$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Out = Join-Path $Root "play-store-assets"
$Source = Join-Path $Root "tools\play-store-assets.html"
$Edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

if (!(Test-Path $Edge)) {
  throw "Microsoft Edge not found at $Edge"
}

New-Item -ItemType Directory -Force -Path $Out | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Out "phone-screenshots") | Out-Null

$sourceUri = (New-Object System.Uri($Source)).AbsoluteUri

function Export-Asset {
  param(
    [string]$Asset,
    [string]$Output,
    [int]$Width,
    [int]$Height
  )
  $url = "$sourceUri`?asset=$Asset"
  $args = @(
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=$Width,$Height",
    "--screenshot=$Output",
    $url
  )
  & $Edge $args | Out-Null
  if (!(Test-Path $Output)) {
    throw "Failed to create $Output"
  }
}

function New-PlayStoreIcon {
  param([string]$Output)

  Add-Type -AssemblyName System.Drawing
  $bitmap = New-Object System.Drawing.Bitmap(512, 512)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = New-Object System.Drawing.Rectangle(0, 0, 512, 512)
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(255, 111, 38, 53), [System.Drawing.Color]::FromArgb(255, 75, 21, 32), 135)
    $graphics.FillRectangle($background, $rect)
    $background.Dispose()

    $highlight1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(58, 255, 245, 230))
    $highlight2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(64, 215, 170, 70))
    $graphics.FillEllipse($highlight1, -54, -76, 386, 330)
    $graphics.FillEllipse($highlight2, 102, 54, 308, 308)
    $highlight1.Dispose()
    $highlight2.Dispose()

    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(138, 215, 170, 70), 10)
    $graphics.DrawRectangle($borderPen, 5, 5, 502, 502)
    $borderPen.Dispose()

    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(92, 62, 39, 35))
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 215, 170, 70))
    $creamBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 253, 245, 230))
    $graphics.FillRectangle($shadowBrush, 199, 112, 128, 56)
    $graphics.FillRectangle($shadowBrush, 233, 88, 60, 90)
    $graphics.FillRectangle($goldBrush, 194, 104, 132, 54)
    $graphics.FillRectangle($goldBrush, 222, 82, 76, 76)

    $fontFamily = New-Object System.Drawing.FontFamily("Georgia")
    $font = New-Object System.Drawing.Font($fontFamily, 248, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.DrawString("P", $font, $shadowBrush, 164, 148)
    $graphics.DrawString("P", $font, $creamBrush, 156, 140)

    $font.Dispose()
    $fontFamily.Dispose()
    $creamBrush.Dispose()
    $goldBrush.Dispose()
    $shadowBrush.Dispose()

    $bitmap.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

New-PlayStoreIcon -Output (Join-Path $Out "app-icon-512.png")

function Crop-ContentToPng {
  param(
    [string]$InputPath,
    [string]$OutputPath,
    [int]$Width,
    [int]$Height
  )
  Add-Type -AssemblyName System.Drawing
  $source = [System.Drawing.Image]::FromFile($InputPath)
  try {
    $lastContentY = $source.Height - 1
    for ($y = $source.Height - 1; $y -ge 0; $y--) {
      $hasContent = $false
      for ($x = 0; $x -lt $source.Width; $x += 16) {
        $pixel = $source.GetPixel($x, $y)
        if (!($pixel.R -gt 248 -and $pixel.G -gt 248 -and $pixel.B -gt 248)) {
          $hasContent = $true
          break
        }
      }
      if ($hasContent) {
        $lastContentY = $y
        break
      }
    }
    $lastContentX = $source.Width - 1
    for ($x = $source.Width - 1; $x -ge 0; $x--) {
      $hasContent = $false
      for ($y = 0; $y -lt $source.Height; $y += 16) {
        $pixel = $source.GetPixel($x, $y)
        if (!($pixel.R -gt 248 -and $pixel.G -gt 248 -and $pixel.B -gt 248)) {
          $hasContent = $true
          break
        }
      }
      if ($hasContent) {
        $lastContentX = $x
        break
      }
    }
    $sourceRect = New-Object System.Drawing.Rectangle(0, 0, [Math]::Min($source.Width, $lastContentX + 1), [Math]::Min($source.Height, $lastContentY + 1))
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.DrawImage($source, $destRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
      $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

$featureTmp = Join-Path $Out "_feature-render-tmp.png"
Export-Asset -Asset "feature" -Output $featureTmp -Width 1024 -Height 620
Crop-ContentToPng -InputPath $featureTmp -OutputPath (Join-Path $Out "feature-graphic-1024x500.png") -Width 1024 -Height 500
Remove-Item -LiteralPath $featureTmp -Force

$screens = @(
  "01-map",
  "02-passport",
  "03-routes",
  "04-journal",
  "05-certificates"
)

foreach ($screen in $screens) {
  Export-Asset -Asset $screen -Output (Join-Path $Out "phone-screenshots\$screen.png") -Width 1080 -Height 1920
}

Write-Host "Play Store assets generated in $Out"
