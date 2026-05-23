Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

function New-IconBitmap {
    param([string]$Path)

    $source = [System.Drawing.Bitmap]::FromFile($Path)
    $bitmap = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.DrawImage($source, 0, 0, $source.Width, $source.Height)
    $graphics.Dispose()
    $source.Dispose()

    return $bitmap
}

function Clear-CornerMatte {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [int]$Tolerance = 18
    )

    $width = $Bitmap.Width
    $height = $Bitmap.Height
    $visited = New-Object 'bool[,]' $width, $height
    $queue = New-Object System.Collections.Generic.Queue[object]
    $corners = @(
        @(0, 0),
        @(($width - 1), 0),
        @(0, ($height - 1)),
        @(($width - 1), ($height - 1))
    )

    foreach ($corner in $corners) {
        $queue.Enqueue($corner)
    }

    while ($queue.Count -gt 0) {
        $point = $queue.Dequeue()
        $x = [int]$point[0]
        $y = [int]$point[1]

        if ($x -lt 0 -or $x -ge $width -or $y -lt 0 -or $y -ge $height) { continue }
        if ($visited[$x, $y]) { continue }
        $visited[$x, $y] = $true

        $pixel = $Bitmap.GetPixel($x, $y)
        if ($pixel.R -gt $Tolerance -or $pixel.G -gt $Tolerance -or $pixel.B -gt $Tolerance) { continue }

        $Bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $pixel.R, $pixel.G, $pixel.B))
        $queue.Enqueue(@(($x + 1), $y))
        $queue.Enqueue(@(($x - 1), $y))
        $queue.Enqueue(@($x, ($y + 1)))
        $queue.Enqueue(@($x, ($y - 1)))
    }
}

function New-ResizedBitmap {
    param(
        [System.Drawing.Bitmap]$Source,
        [int]$Size,
        [bool]$Round = $false
    )

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)

    if ($Round) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $Size, $Size)
        $graphics.SetClip($path)
        $path.Dispose()
    }

    $graphics.DrawImage($Source, 0, 0, $Size, $Size)
    $graphics.Dispose()

    return $bitmap
}

function Save-Png {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$Path
    )

    $directory = Split-Path -Parent $Path
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory | Out-Null
    }
    $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Export-IconSet {
    param(
        [System.Drawing.Bitmap]$Source,
        [hashtable]$Targets,
        [bool]$Round = $false
    )

    foreach ($entry in $Targets.GetEnumerator()) {
        $bitmap = New-ResizedBitmap -Source $Source -Size $entry.Value -Round $Round
        Save-Png -Bitmap $bitmap -Path (Join-Path $projectRoot $entry.Key)
        $bitmap.Dispose()
    }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot 'assets/app-icon-photo-source.png'

if (-not (Test-Path $sourcePath)) {
    throw "Missing source icon: $sourcePath"
}

$sourceBitmap = New-IconBitmap -Path $sourcePath
Clear-CornerMatte -Bitmap $sourceBitmap

$fullSizes = @{
    'icon-512.png' = 512
    'icon-192.png' = 192
    'www/icon-512.png' = 512
    'www/icon-192.png' = 192
    'android/app/src/main/assets/public/icon-512.png' = 512
    'android/app/src/main/assets/public/icon-192.png' = 192
    'play-store-assets/app-icon-512.png' = 512
    'android/app/src/main/res/mipmap-mdpi/ic_launcher.png' = 48
    'android/app/src/main/res/mipmap-hdpi/ic_launcher.png' = 72
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png' = 96
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png' = 144
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png' = 192
}

$roundSizes = @{
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png' = 48
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png' = 72
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png' = 96
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png' = 144
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png' = 192
}

$foregroundSizes = @{
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png' = 108
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png' = 162
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png' = 216
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png' = 324
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png' = 432
}

Export-IconSet -Source $sourceBitmap -Targets $fullSizes
Export-IconSet -Source $sourceBitmap -Targets $roundSizes -Round $true
Export-IconSet -Source $sourceBitmap -Targets $foregroundSizes

$sourceBitmap.Dispose()

Write-Host 'Photographic app icons regenerated.'
