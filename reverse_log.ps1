$Log = Get-Content .\tmp_upload.log
$ArrayList = New-Object System.Collections.ArrayList

if($Log.Count -gt 20){
    $index = $Log.Count-20
}else{
    $index = 0
}

#Set-Content .\upload.log -value $null
if($Log.Count -ge 1){

    ($Log.Count-1)..$index | ForEach-Object {
        $ArrayList.Add($Log[$_]) > $null
    }
    
    do{
        try{
            Set-Content .\upload.log -Value $ArrayList -ErrorAction stop
            $failed = $false
        }catch{
            $failed = $true
        }
    }while($failed)   
}