"use client"

import { useState, useRef, useCallback } from "react"
import { Header } from "@/components/sections/Header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, QrCode, Download, Copy, RefreshCw } from "lucide-react"
import Link from "next/link"
import QRCode from "qrcode"
import { useToast } from "@/hooks/use-toast"

type QRInputType = "url" | "text" | "email" | "phone" | "sms" | "wifi"
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

const INPUT_TYPES: { value: QRInputType; label: string; placeholder: string }[] = [
  { value: "url", label: "URL", placeholder: "https://example.com" },
  { value: "text", label: "Plain Text", placeholder: "Enter your text here..." },
  { value: "email", label: "Email", placeholder: "example@email.com" },
  { value: "phone", label: "Phone Number", placeholder: "+1234567890" },
  { value: "sms", label: "SMS", placeholder: "+1234567890" },
  { value: "wifi", label: "Wi-Fi", placeholder: "Network name (SSID)" },
]

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: "L", label: "Low (7%)", description: "Smallest QR, less resilient" },
  { value: "M", label: "Medium (15%)", description: "Good balance (default)" },
  { value: "Q", label: "Quartile (25%)", description: "Higher resilience" },
  { value: "H", label: "High (30%)", description: "Most resilient, largest QR" },
]

function buildQRContent(type: QRInputType, input: string, extra: { smsMessage?: string; wifiPassword?: string; wifiEncryption?: string; wifiHidden?: boolean }): string {
  switch (type) {
    case "url":
      return input.startsWith("http://") || input.startsWith("https://") ? input : `https://${input}`
    case "email":
      return `mailto:${input}`
    case "phone":
      return `tel:${input}`
    case "sms":
      return extra.smsMessage ? `smsto:${input}:${extra.smsMessage}` : `sms:${input}`
    case "wifi": {
      const enc = extra.wifiEncryption || "WPA"
      const hidden = extra.wifiHidden ? "true" : "false"
      const pass = extra.wifiPassword || ""
      return `WIFI:T:${enc};S:${input};P:${pass};H:${hidden};;`
    }
    default:
      return input
  }
}

export default function QRCodeGeneratorPage() {
  const [inputType, setInputType] = useState<QRInputType>("url")
  const [inputValue, setInputValue] = useState("")
  const [smsMessage, setSmsMessage] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiEncryption, setWifiEncryption] = useState("WPA")
  const [wifiHidden, setWifiHidden] = useState(false)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [size, setSize] = useState("300")
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("M")
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateQR = useCallback(async () => {
    const trimmed = inputValue.trim()
    if (!trimmed) {
      toast({ title: "Input required", description: "Please enter a value to generate a QR code.", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    try {
      const content = buildQRContent(inputType, trimmed, {
        smsMessage,
        wifiPassword,
        wifiEncryption,
        wifiHidden,
      })

      const dataUrl = await QRCode.toDataURL(content, {
        width: parseInt(size, 10),
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      })
      setQrDataUrl(dataUrl)
    } catch (err) {
      toast({ title: "Generation failed", description: "Could not generate QR code. Please check your input.", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }, [inputType, inputValue, smsMessage, wifiPassword, wifiEncryption, wifiHidden, fgColor, bgColor, size, errorLevel, toast])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `qr-code-${Date.now()}.png`
    link.click()
    toast({ title: "Downloaded!", description: "QR code saved as PNG." })
  }

  const handleCopyImage = async () => {
    if (!qrDataUrl) return
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      toast({ title: "Copied!", description: "QR code image copied to clipboard." })
    } catch {
      toast({ title: "Copy failed", description: "Your browser may not support copying images.", variant: "destructive" })
    }
  }

  const handleReset = () => {
    setInputValue("")
    setSmsMessage("")
    setWifiPassword("")
    setWifiEncryption("WPA")
    setWifiHidden(false)
    setFgColor("#000000")
    setBgColor("#ffffff")
    setSize("300")
    setErrorLevel("M")
    setQrDataUrl(null)
  }

  const selectedType = INPUT_TYPES.find((t) => t.value === inputType)!

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container py-8 md:py-12 flex-1">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/tools">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 font-montserrat">
              <span className="gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                QR Code Generator
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Generate QR codes for URLs, text, emails, phone numbers, SMS, and Wi-Fi. Download as PNG or copy to clipboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings Panel */}
            <div className="space-y-4">
              {/* Input Type */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-montserrat">Content</CardTitle>
                  <CardDescription>Select the type and enter your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <select
                      value={inputType}
                      onChange={(e) => { setInputType(e.target.value as QRInputType); setInputValue(""); setQrDataUrl(null) }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    >
                      {INPUT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {inputType === "text" ? (
                    <div className="space-y-1.5">
                      <Label>{selectedType.label}</Label>
                      <Textarea
                        placeholder={selectedType.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label>{selectedType.label}</Label>
                      <Input
                        placeholder={selectedType.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        type={inputType === "email" ? "email" : inputType === "phone" || inputType === "sms" ? "tel" : "text"}
                      />
                    </div>
                  )}

                  {inputType === "sms" && (
                    <div className="space-y-1.5">
                      <Label>Message (optional)</Label>
                      <Input
                        placeholder="Pre-filled SMS message"
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                      />
                    </div>
                  )}

                  {inputType === "wifi" && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          placeholder="Wi-Fi password"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Encryption</Label>
                        <select
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="wifi-hidden"
                          type="checkbox"
                          checked={wifiHidden}
                          onChange={(e) => setWifiHidden(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="wifi-hidden" className="cursor-pointer font-normal">Hidden network</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customization */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-montserrat">Customization</CardTitle>
                  <CardDescription>Adjust colors, size, and error correction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Foreground color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent p-0.5"
                        />
                        <Input
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="font-mono uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Background color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent p-0.5"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="font-mono uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Size (px)</Label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      >
                        <option value="150">150 × 150</option>
                        <option value="200">200 × 200</option>
                        <option value="300">300 × 300</option>
                        <option value="400">400 × 400</option>
                        <option value="500">500 × 500</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Error correction</Label>
                      <select
                        value={errorLevel}
                        onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      >
                        {ERROR_LEVELS.map((l) => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={generateQR}
                  disabled={isGenerating || !inputValue.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                >
                  {isGenerating ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><QrCode className="h-4 w-4 mr-2" />Generate QR Code</>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} title="Reset all fields">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col">
              <Card className="border-none shadow-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-montserrat">Preview</CardTitle>
                  <CardDescription>Your generated QR code will appear here</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[360px]">
                  {qrDataUrl ? (
                    <>
                      <div
                        className="rounded-xl overflow-hidden shadow-md border border-border"
                        style={{ background: bgColor }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrDataUrl}
                          alt="Generated QR Code"
                          width={parseInt(size, 10)}
                          height={parseInt(size, 10)}
                          className="block max-w-full"
                          style={{ maxWidth: "280px", height: "auto" }}
                        />
                      </div>

                      <div className="flex gap-3 w-full max-w-xs">
                        <Button
                          onClick={handleDownload}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PNG
                        </Button>
                        <Button variant="outline" onClick={handleCopyImage} title="Copy image to clipboard">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        {parseInt(size, 10)} × {parseInt(size, 10)} px · Error correction: {errorLevel}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                      <div className="p-6 rounded-2xl bg-muted/50">
                        <QrCode className="h-16 w-16 opacity-30" />
                      </div>
                      <p className="text-sm text-center max-w-xs">
                        Fill in the content on the left and click <strong>Generate QR Code</strong> to create your QR code.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Usage tips */}
              <Card className="border-none shadow-md mt-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tips</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use <strong>High</strong> error correction if you plan to print the QR code</li>
                    <li>• Wi-Fi QR codes let guests join your network by scanning</li>
                    <li>• Test your QR code with a phone camera before printing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
