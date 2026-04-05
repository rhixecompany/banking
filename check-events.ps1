# Check for bugcheck/power-related events in System log
Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2} -MaxEvents 100 |
    Where-Object {
        $_.ProviderName -match 'BugCheck|Kernel-Power|Power-Troubleshooter|WHEA-Logger|microsoft-windows-kernel'
    } |
    Select-Object TimeCreated, ProviderName, Id, Message |
    Format-List