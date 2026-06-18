# build.ps1
# Native PowerShell script to compile Launchpad src files into root index.html

$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { "." }
$srcDir = Join-Path $scriptRoot "src"
$htmlPath = Join-Path $srcDir "index.html"
$cssPath = Join-Path $srcDir "style.css"
$jsPath = Join-Path $srcDir "app.js"
$outputPath = Join-Path $scriptRoot "index.html"

# Validate required source files
if (!(Test-Path $htmlPath) -or !(Test-Path $cssPath) -or !(Test-Path $jsPath)) {
    Write-Error "Required source files (index.html, style.css, app.js) not found in $srcDir."
    exit 1
}

Write-Host "Reading source files..."
$html = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
$css = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)

Write-Host "Merging styles and scripts..."
# Replace CSS link placeholder
$cssPlaceholder = '<link rel="stylesheet" href="style.css">'
$cssReplacement = "<style>`r`n$css`r`n</style>"
$html = $html.Replace($cssPlaceholder, $cssReplacement)

# Replace JS script placeholder
$jsPlaceholder = '<script src="app.js"></script>'
$jsReplacement = "<script>`r`n$js`r`n</script>"
$html = $html.Replace($jsPlaceholder, $jsReplacement)

Write-Host "Writing to root index.html..."
# Write without BOM using UTF8NoBOM encoding
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputPath, $html, $utf8NoBom)

Write-Host "Successfully merged src files into root index.html!"
