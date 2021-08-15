$now = Get-Date
$mymods = (Get-Item $profile).Directory.FullName
Set-Alias "magick" "C:\programs\ImageMagick-7.0.10-Q16-HDRI\magick.exe" -Description "user";
. $mymods\hmscalc.ps1
. $mymods\Find-ImageDimensions.ps1
$filterList = @(".png",".jpg",".jpeg",".gif",".webp");
$image = Get-Item (".\req\"+(Get-Content .\request)).ToString()
if($filterList.Contains($image.Extension)){
    $name = $image.name.replace($image.extension, '')
    magick convert $image -resize 512x512 (".\autoproc\$name"+"_512.png")
    move-item $image -Destination .\src\
    [System.IO.File]::WriteAllText(".\request",($name+"_512.png").ToString(),[System.Text.Encoding]::ASCII);
    Start-Sleep -Milliseconds 250
    #($name+"_512.png").ToString() | Out-File ".\request"
    bash -c 'bash /mnt/c/tmp/mjarni_posting_stickers/autosticker.sh'
}
$procEnd = Get-Date
$procTotal = hmscalc (($procEnd-$now).totalSeconds) 0
write-host "Processing took $procTotal."