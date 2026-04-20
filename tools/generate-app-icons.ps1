Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

function New-RoundedRectPath {
    param(
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $Radius * 2
    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-Color {
    param(
        [int]$A,
        [string]$Hex
    )

    $color = [System.Drawing.ColorTranslator]::FromHtml($Hex)
    return [System.Drawing.Color]::FromArgb($A, $color.R, $color.G, $color.B)
}

function Draw-Cross {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$Size,
        [float]$CenterX,
        [float]$TopY,
        [System.Drawing.Brush]$Brush
    )

    $barWidth = $Size * 0.12
    $barHeight = $Size * 0.2
    $armWidth = $Size * 0.22
    $armHeight = $Size * 0.08

    $verticalPath = New-RoundedRectPath -X ($CenterX - ($barWidth / 2)) -Y $TopY -Width $barWidth -Height $barHeight -Radius ($barWidth * 0.18)
    $horizontalY = $TopY + ($barHeight * 0.34)
    $horizontalPath = New-RoundedRectPath -X ($CenterX - ($armWidth / 2)) -Y $horizontalY -Width $armWidth -Height $armHeight -Radius ($armHeight * 0.3)

    $Graphics.FillPath($Brush, $verticalPath)
    $Graphics.FillPath($Brush, $horizontalPath)

    $verticalPath.Dispose()
    $horizontalPath.Dispose()
}

function Draw-PGlyph {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$Size,
        [System.Drawing.Brush]$Brush,
        [System.Drawing.Brush]$ShadowBrush,
        [bool]$IncludeShadow
    )

    $family = New-Object System.Drawing.FontFamily('Georgia')
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    $layout = [System.Drawing.RectangleF]::new([float]($Size * 0.11), [float]($Size * 0.27), [float]($Size * 0.78), [float]($Size * 0.56))
    $fontEm = $Size * 0.5

    if ($IncludeShadow) {
        $shadowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $shadowRect = [System.Drawing.RectangleF]::new([float]($layout.X + ($Size * 0.014)), [float]($layout.Y + ($Size * 0.014)), [float]$layout.Width, [float]$layout.Height)
        $shadowPath.AddString('P', $family, [int][System.Drawing.FontStyle]::Bold, $fontEm, $shadowRect, $format)
        $Graphics.FillPath($ShadowBrush, $shadowPath)
        $shadowPath.Dispose()
    }

    $textPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $textPath.AddString('P', $family, [int][System.Drawing.FontStyle]::Bold, $fontEm, $layout, $format)
    $Graphics.FillPath($Brush, $textPath)

    $outlinePen = New-Object System.Drawing.Pen((New-Color -A 58 -Hex '#E4BB6A'), [float]($Size * 0.009))
    $outlinePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $Graphics.DrawPath($outlinePen, $textPath)

    $outlinePen.Dispose()
    $textPath.Dispose()
    $format.Dispose()
    $family.Dispose()
}

function Draw-BrandSymbol {
    param(
        [System.Drawing.Graphics]$Graphics,
        [float]$Size,
        [bool]$IncludeShadow = $true
    )

    $gold = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#D1A245'))
    $cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#F7EEDC'))
    $shadow = New-Object System.Drawing.SolidBrush((New-Color -A 70 -Hex '#2E101A'))

    if ($IncludeShadow) {
        Draw-Cross -Graphics $Graphics -Size $Size -CenterX ($Size * 0.5) -TopY ($Size * 0.17 + ($Size * 0.012)) -Brush $shadow
    }
    Draw-Cross -Graphics $Graphics -Size $Size -CenterX ($Size * 0.5) -TopY ($Size * 0.17) -Brush $gold
    Draw-PGlyph -Graphics $Graphics -Size $Size -Brush $cream -ShadowBrush $shadow -IncludeShadow $IncludeShadow

    $gold.Dispose()
    $cream.Dispose()
    $shadow.Dispose()
}

function New-BaseBitmap {
    param([int]$Size)

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    return @{ Bitmap = $bitmap; Graphics = $graphics }
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

function Draw-FullIcon {
    param(
        [int]$Size,
        [bool]$Round = $false
    )

    $surface = New-BaseBitmap -Size $Size
    $bitmap = $surface.Bitmap
    $graphics = $surface.Graphics

    $backgroundRect = [System.Drawing.RectangleF]::new(0.0, 0.0, [float]$Size, [float]$Size)
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush($backgroundRect, [System.Drawing.ColorTranslator]::FromHtml('#8B4551'), [System.Drawing.ColorTranslator]::FromHtml('#5E2331'), 55.0)

    if ($Round) {
        $graphics.FillEllipse($gradient, 0, 0, $Size, $Size)
    } else {
        $radius = $Size * 0.22
        $roundedPath = New-RoundedRectPath -X 0 -Y 0 -Width $Size -Height $Size -Radius $radius
        $graphics.FillPath($gradient, $roundedPath)

        $borderPen = New-Object System.Drawing.Pen((New-Color -A 55 -Hex '#E7C474'), [float]($Size * 0.01))
        $borderPen.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Inset
        $graphics.DrawPath($borderPen, $roundedPath)
        $borderPen.Dispose()
        $roundedPath.Dispose()
    }

    $glowBrush = New-Object System.Drawing.SolidBrush((New-Color -A 34 -Hex '#F8F0DF'))
    $graphics.FillEllipse($glowBrush, -($Size * 0.08), -($Size * 0.08), $Size * 0.75, $Size * 0.6)
    $glowBrush.Dispose()

    $haloBrush = New-Object System.Drawing.SolidBrush((New-Color -A 28 -Hex '#D1A245'))
    $graphics.FillEllipse($haloBrush, $Size * 0.2, $Size * 0.1, $Size * 0.6, $Size * 0.6)
    $haloBrush.Dispose()

    Draw-BrandSymbol -Graphics $graphics -Size $Size -IncludeShadow $true

    $gradient.Dispose()
    $graphics.Dispose()

    return $bitmap
}

function Draw-AdaptiveForeground {
    param([int]$Size)

    $surface = New-BaseBitmap -Size $Size
    $bitmap = $surface.Bitmap
    $graphics = $surface.Graphics

    Draw-BrandSymbol -Graphics $graphics -Size $Size -IncludeShadow $false
    $graphics.Dispose()

    return $bitmap
}

$projectRoot = Split-Path -Parent $PSScriptRoot

$fullSizes = @{
    'www/icon-512.png' = 512
    'www/icon-192.png' = 192
    'icon-512.png' = 512
    'icon-192.png' = 192
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

foreach ($entry in $fullSizes.GetEnumerator()) {
    $bitmap = Draw-FullIcon -Size $entry.Value
    Save-Png -Bitmap $bitmap -Path (Join-Path $projectRoot $entry.Key)
    $bitmap.Dispose()
}

foreach ($entry in $roundSizes.GetEnumerator()) {
    $bitmap = Draw-FullIcon -Size $entry.Value -Round $true
    Save-Png -Bitmap $bitmap -Path (Join-Path $projectRoot $entry.Key)
    $bitmap.Dispose()
}

foreach ($entry in $foregroundSizes.GetEnumerator()) {
    $bitmap = Draw-AdaptiveForeground -Size $entry.Value
    Save-Png -Bitmap $bitmap -Path (Join-Path $projectRoot $entry.Key)
    $bitmap.Dispose()
}

Write-Host 'App icons regenerated.'
