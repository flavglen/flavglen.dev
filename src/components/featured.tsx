export const Featured  = () => {
    return (
        <div className="container mt-6">
            <h3> Featured posts </h3>
            <article className="grid md:grid-cols-5 md:grid-flow-col grid-cols-1 rid-flow-row mt-4 border-b pb-2 md:gap-4">
                <div className="col-span-1">
                    <img className="rounded-lg shadow-xl" src="https://flavglen.github.io/images/PXL_dp.jpg" alt="Glen Pais" width={'auto'} height={200} />
                </div>

                <div  className="col-span-4">
                    <h2 className="text-2xl md:mt-0 mt-3"> Title of the post </h2>

                    <span className="flex gap-4 mt-2">
                        <span className="bg-stone-400 rounded-full text-xs p-2">2020</span>
                        <span>Loblaws</span>
                    </span>

                    <p className="mt-3">Loblaw.ca provides customers with the convenience of online grocery shopping. 
                        Customers can browse through a wide range of products, add them to their</p>
                </div>
            </article>

        </div>
      
    )
}

