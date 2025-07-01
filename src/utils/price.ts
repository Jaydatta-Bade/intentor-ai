export async function getNearPriceUSD(): Promise<number> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
  );
  if (!res.ok) throw new Error("Failed to fetch NEAR price");
  const data = await res.json();
  return data.near.usd;
} 