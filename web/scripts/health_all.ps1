param([string]$Base="https://www.parlios.fr")
$Fn="$Base/.netlify/functions"
$tests = @(
  @{ name="GET /health";   url="$Fn/health";   method="GET"  },
  @{ name="POST /ai-bio";  url="$Fn/ai-bio";   method="POST"; body=@{prompt="Bio pro pour CEO SaaS orientée impact";tone="LinkedIn"} },
  @{ name="POST /headline";url="$Fn/headline"; method="POST"; body=@{prompt="Landing IA gratuite + 3 mini-outils + score gamifié";tone="Direct Response"} },
  @{ name="POST /summary"; url="$Fn/summary";  method="POST"; body=@{prompt=$Base;tone="Bullet executive + actions"} }
)
foreach($t in $tests){
  try{
    if($t.method -eq "POST"){
      $b = ($t.body | ConvertTo-Json)
      $r = Invoke-RestMethod -Uri $t.url -Method POST -ContentType "application/json; charset=utf-8" -Body $b
    } else {
      $r = Invoke-RestMethod -Uri $t.url -Method GET
    }
    Write-Host ("{0} => OK" -f $t.name) -ForegroundColor Green
  } catch {
    $resp = $_.Exception.Response
    if ($resp -and $resp.GetResponseStream()) {
      $reader = New-Object IO.StreamReader($resp.GetResponseStream())
      $msg = $reader.ReadToEnd()
      Write-Host ("{0} => FAIL: {1}`nBODY: {2}" -f $t.name, $_.Exception.Message, $msg) -ForegroundColor Red
    } else {
      Write-Host ("{0} => FAIL: {1}" -f $t.name, $_.Exception.Message) -ForegroundColor Red
    }
  }
}
