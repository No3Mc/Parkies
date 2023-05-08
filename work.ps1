# Start-Process -FilePath "https://github.com/P4RKI3/Parkie"
# Start-Process -FilePath "https://github.com/P4RKI3/Parkie/releases"
# Start-Process -FilePath "https://github.com/P4RKI3/Parkie/issues"
# Start-Process -FilePath "https://github.com/P4RKI3/Parkie/actions"
# Start-Process -FilePath "https://github.com/P4RKI3/.github/wiki"
# Start-Process -FilePath "https://portal.azure.com/#@DeMontfortUniversity.onmicrosoft.com/resource/subscriptions/163642f3-7dde-4df1-b7a3-ef411bd2541c/resourceGroups/Parkie_group/overview"
# Start-Process -FilePath "https://www.google.com/search?sxsrf=AJOqlzV_i468ylcqcBV6bIzggCGvvXj0Lw%3A1675455164349&q=Parkie&stick=H4sIAAAAAAAAAONgU1I1qDCxMDc3M7QwT7JMSbY0TUyxMqiwTE02SzRINE5KTkk1NzE2WMTKFpBYlJ2ZCgBKVZiCMgAAAA&mat=CSQ0NMCPh89N&ved=2ahUKEwiGzaHvlPr8AhWCgVwKHX8AAysQrMcEegQICBAD"
# Start-Process -FilePath "https://domains.google.com/registrar/parkie.app/dns?hl=en&_ga=2.8834167.354293375.1673439906-940204161.1673120087"
# Start-Process -FilePath "https://developers.facebook.com/apps/875175060267333/dashboard/?business_id=534528355408641"
# Start-Process -FilePath "https://console.cloud.google.com/apis/dashboard?project=parkie-org&supportedpurview=project"
# Start-Process -FilePath "https://portal.azure.com/#@DeMontfortUniversity.onmicrosoft.com/resource/subscriptions/163642f3-7dde-4df1-b7a3-ef411bd2541c/resourceGroups/Parkie_group/providers/Microsoft.Web/staticSites/Parkie/staticsite"
# Start-Process -FilePath "https://portal.azure.com/#@DeMontfortUniversity.onmicrosoft.com/resource/subscriptions/163642f3-7dde-4df1-b7a3-ef411bd2541c/resourceGroups/Parkie_group/providers/Microsoft.Sql/servers/parkiedb/overview"
# Start-Process -FilePath "https://portal.azure.com/#@DeMontfortUniversity.onmicrosoft.com/resource/subscriptions/163642f3-7dde-4df1-b7a3-ef411bd2541c/resourceGroups/Parkie_group/providers/Microsoft.Sql/servers/parkiedb/databases/parkiedb/overview"
# Start-Process -FilePath "https://portal.azure.com/#@DeMontfortUniversity.onmicrosoft.com/resource/subscriptions/163642f3-7dde-4df1-b7a3-ef411bd2541c/resourceGroups/Parkie_group/providers/Microsoft.Storage/storageAccounts/parkiegroup9013/storagebrowser"
# Start-Process -FilePath "https://portal.azure.com/#@DeMontfortUniversity.onmicrosoft.com/resource/subscriptions/163642f3-7dde-4df1-b7a3-ef411bd2541c/resourceGroups/Parkie_group/providers/microsoft.insights/components/parkie/overview"
# Start-Process -FilePath "www.parkie.app"

$black = [char]27 + '[1;30m'
$red = [char]27 + '[1;31m'
$green = [char]27 + '[1;32m'
$yellow = [char]27 + '[1;33m'
$blue = [char]27 + '[1;34m'
$magenta = [char]27 + '[1;35m'
$cyan = [char]27 + '[1;36m'
$white = [char]27 + '[1;37m'
$reset = [char]27 + '[0m'

Write-Output "${green}Running server.js written by UMAR SOOMRO${reset}"
Start-Process node -ArgumentList "Core/routes/ParkDev/parking/server.js" -NoNewWindow
Start-Sleep -Seconds 1

Write-Output "${green}Running Promos.js written by YO BOI SYED${reset}"
Start-Process python -ArgumentList "Core/routes/CustDev/AbtPro/Promos.py" -NoNewWindow



while($true) {
  Start-Sleep -Seconds 1
}



#
# Start-Process -FilePath
#
