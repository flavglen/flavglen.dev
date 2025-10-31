import { db } from "@/lib/firebase-server";
import { saveLog } from "./common-server";

export interface CloneCollectionResult {
  success: boolean;
  sourceCollection: string;
  targetCollection: string;
  documentsCopied: number;
  errors: number;
  errorDetails: Array<{
    docId: string;
    error: string;
  }>;
}

/**
 * Clone a Firestore collection to another collection
 * This creates a complete copy of all documents in the source collection
 */
export async function cloneCollection(
  sourceCollection: string,
  targetCollection: string,
  options: {
    batchSize?: number;
    overwrite?: boolean; // If true, overwrite existing documents in target collection
  } = {}
): Promise<CloneCollectionResult> {
  const {
    batchSize = 500, // Firestore batch limit is 500
    overwrite = false,
  } = options;

  const result: CloneCollectionResult = {
    success: false,
    sourceCollection,
    targetCollection,
    documentsCopied: 0,
    errors: 0,
    errorDetails: [],
  };

  try {
    console.log(`Starting collection clone from ${sourceCollection} to ${targetCollection}...`);

    // Check if source collection exists and get all documents
    const sourceSnapshot = await db.collection(sourceCollection).get();
    console.log(`Found ${sourceSnapshot.docs.length} documents in ${sourceCollection}`);

    if (sourceSnapshot.docs.length === 0) {
      console.log("Source collection is empty. Clone complete.");
      result.success = true;
      return result;
    }

    // If overwrite is false, check if target collection has any documents
    if (!overwrite) {
      const targetSnapshot = await db.collection(targetCollection).limit(1).get();
      if (!targetSnapshot.empty) {
        throw new Error(
          `Target collection ${targetCollection} already contains documents. Set overwrite=true to proceed.`
        );
      }
    }

    // Clone documents in batches
    console.log(`Cloning ${sourceSnapshot.docs.length} documents in batches of ${batchSize}...`);

    for (let i = 0; i < sourceSnapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = sourceSnapshot.docs.slice(i, i + batchSize);
      let batchCopied = 0;

      batchDocs.forEach((sourceDoc) => {
        try {
          const data = sourceDoc.data();
          const targetDocRef = db.collection(targetCollection).doc(sourceDoc.id);

          // Firestore batch.set overwrites by default
          // If overwrite=false, we already checked that target collection is empty
          batch.set(targetDocRef, data);

          batchCopied++;
        } catch (error: any) {
          console.error(`Error preparing document ${sourceDoc.id} for cloning:`, error);
          result.errors++;
          result.errorDetails.push({
            docId: sourceDoc.id,
            error: error.message || String(error),
          });
        }
      });

      try {
        await batch.commit();
        result.documentsCopied += batchCopied;
        console.log(
          `Batch ${Math.floor(i / batchSize) + 1} completed: Copied ${batchCopied} documents`
        );
      } catch (error: any) {
        console.error(`Error committing batch ${Math.floor(i / batchSize) + 1}:`, error);
        result.errors += batchCopied;
        batchDocs.forEach((doc) => {
          result.errorDetails.push({
            docId: doc.id,
            error: `Batch commit failed: ${error.message || String(error)}`,
          });
        });
      }
    }

    console.log(`\nClone completed successfully!`);
    console.log(`- Documents copied: ${result.documentsCopied}`);
    console.log(`- Errors: ${result.errors}`);

    result.success = result.errors === 0;
    saveLog(
      {
        message: `Collection clone completed: ${sourceCollection} -> ${targetCollection}`,
        data: {
          documentsCopied: result.documentsCopied,
          errors: result.errors,
        },
      },
      result.success
    );

    return result;
  } catch (error: any) {
    console.error("Collection clone failed:", error);
    result.success = false;
    result.errors++;
    result.errorDetails.push({
      docId: "clone",
      error: error.message || String(error),
    });

    saveLog(
      {
        message: `Collection clone failed: ${sourceCollection} -> ${targetCollection}`,
        error,
        data: {
          documentsCopied: result.documentsCopied,
        },
      },
      false
    );

    return result;
  }
}

