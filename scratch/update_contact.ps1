$files = @(
    'client\src\pages\ContactPage.jsx',
    'client\src\pages\AdminDashboardPage.jsx',
    'client\src\components\Footer.jsx',
    'client\src\components\EnquiryModal.jsx',
    'client\src\components\AuthModal.jsx',
    'client\src\components\SEO.jsx',
    'client\src\pages\PropertyDetailPage.jsx',
    'client\src\pages\HomePage.jsx',
    'server\src\models\db.js',
    'server\src\data\seedData.js',
    'server\data\store.json',
    'server\src\data\store.json'
)

foreach ($file in $files) {
    if (-Not (Test-Path $file)) {
        Write-Host "SKIP (not found): $file"
        continue
    }
    $content = Get-Content $file -Raw -Encoding UTF8

    # 1. Email
    $content = $content -replace 'akanbisamuel045@gmail\.com', 'jkcube85@gmail.com'

    # 2. Address in footer/contact - old address line
    $content = $content -replace '1004 Estate, Adetokunbo Ademola, Victoria Island, Lagos', 'Suite 337, 3rd Floor, Ikeja Plaza, Ikeja, Lagos'
    $content = $content -replace '1004 Estate, Adetokunbo Ademola / Ozumba Mbadiwe Way, Victoria Island, Lagos', 'Suite 337, 3rd Floor, Ikeja Plaza, Ikeja, Lagos'
    $content = $content -replace '1004 Estate, Adetokunbo Ademola Street, Victoria Island, Lagos, Nigeria', 'Suite 337, 3rd Floor, Ikeja Plaza, Ikeja, Lagos, Nigeria'
    $content = $content -replace '1004 Estate, Adetokunbo\r?\nAdemola, Victoria Island, Lagos', 'Suite 337, 3rd Floor, Ikeja Plaza, Ikeja, Lagos'
    $content = $content -replace 'Adetokunbo Ademola, Victoria Island, Lagos', 'Suite 337, 3rd Floor, Ikeja Plaza, Ikeja, Lagos'

    # 3. Primary phone +234 703 846 2284 -> keep it but add second contact
    # We only add the extra line where needed; just ensure old number is present as-is
    # Additional contact number inserted in ContactPage and Footer separately below
    Set-Content $file -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Updated: $file"
}
