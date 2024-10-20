function Get-Tree {
    param(
        [string]$Path = (Get-Location),   # Sử dụng Get-Location để lấy thư mục hiện tại
        [string]$Prefix = "",
        [string[]]$IgnoreList = @()         # Danh sách cần bỏ qua
    )

    $items = Get-ChildItem -Path $Path
    $itemsCount = $items.Count
    $counter = 1

    foreach ($item in $items) {
        # Bỏ qua các mục nằm trong danh sách IgnoreList
        if ($IgnoreList -contains $item.Name) {
            continue
        }

        if ($counter -eq $itemsCount) {
            $symbol = "└──"
            $newPrefix = "$Prefix    "
        }
        else {
            $symbol = "├──"
            $newPrefix = "$Prefix│   "
        }

        # Sử dụng Write-Output để ghi vào pipeline
        Write-Output "$Prefix$symbol $($item.Name)"
        
        if ($item.PSIsContainer) {
            Get-Tree -Path $item.FullName -Prefix $newPrefix -IgnoreList $IgnoreList
        }
        $counter++
    }
}

# Lấy thư mục hiện tại
$currentDir = Get-Location

# Khởi tạo danh sách bỏ qua
$ignore = @()

# Hỏi người dùng có muốn bỏ qua thư mục hay tệp nào không
Write-Host "Ban co muon bo qua thu muc hay tep nao khong? (nhap -d <ten thu muc> hoac -i <ten tep>, nhan Enter de dung)"
do {
    $input = Read-Host "Nhap vao (vd: -d ten_thu_muc hoac -i ten_tep, nhan Enter de dung)"
    
    if ($input -match '^-d (.+)$') {
        $folderName = $matches[1]
        $ignore += $folderName
        Write-Host "Da bo qua thu muc: $folderName"
    }
    elseif ($input -match '^-i (.+)$') {
        $fileName = $matches[1]
        $ignore += $fileName
        Write-Host "Da bo qua tep: $fileName"
    }
    elseif ($input -ne "") {
        Write-Host "Nhap khong hop le, vui long nhap lai."
    }

} while ($input -ne "")

# Xuất ra file 'output.txt' với các thư mục/tệp được bỏ qua
Get-Tree $currentDir -IgnoreList $ignore | Out-File "$currentDir\output.txt"

Write-Host "Da hoan thanh, ket qua da duoc luu vao file output.txt."
