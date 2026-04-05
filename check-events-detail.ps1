# Get more detailed power-related events
Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2,3} -MaxEvents 200 |
    Where-Object {
        $_.ProviderName -match 'Kernel-Power|Power-Troubleshooter' -and 
        $_.Id -match '41|42|43|1001|1002|1074|1076'
    } |
    Select-Object TimeCreated, ProviderName, Id, Message |
    Format-List