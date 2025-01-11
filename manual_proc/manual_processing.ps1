$now = Get-Date
#$mymods = (Get-Item $profile).Directory.FullName
$workDir = (Get-Item "C:\tmp\mjarni_posting_stickers\tmp")
$amt = 0;
$pack = "";
foreach ($arg in $args) {
    if ($arg -match "p:") {
        $pack = $arg.ToString().Split(":")[-1]
    }
}
Set-Alias "magick" "C:\programs\ImageMagick-7.0.10-Q16-HDRI\magick.exe" -Description "user";
#Set-Variable "reqFile" (Get-Item "$workDir\request").FullName
#. $mymods\hmscalc.ps1
#. $mymods\Find-ImageDimensions.ps1
$filterList = @(".png", ".jpg", ".jpeg", ".gif", ".webp");
foreach ($image in (Get-Item ".\req\*")) {
    if ($filterList.Contains($image.Extension)) {
        $amt++;
        $name = $image.name.replace($image.extension, '')
        magick convert $image -resize 512x512 ".\autoproc\$($name)_512.png"
        magick ".\autoproc\$($name)_512.png" ".\autoproc\$($name)_512.webp"
        move-item $image -Destination .\src\
        #[System.IO.File]::WriteAllText(($reqFile), ("$($name)_512.png").ToString(), [System.Text.Encoding]::ASCII);
        #Start-Sleep -Milliseconds 250
        #($name + "_512.png").ToString() | Out-File ".\request" -Encoding ascii
        Write-Host "Processing $name.." -NoNewline
    }
}
$procEnd = Get-Date
$procTotal = hmscalc (($procEnd - $now).totalSeconds) 0
write-host "Processing $amt files took $procTotal."