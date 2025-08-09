// worker.ts

const __defProp = Object.defineProperty;
const __name = (target: any, value: string) => __defProp(target, "name", { value, configurable: true });

interface IPData {
  ipv4: string[];
  ipv6: string[];
}

interface Env {
  // Define your environment variables here if needed
}

// worker.js
const worker_default = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const ipData = await fetchIPData();
      const configContent = generateConfig(ipData);
      return new Response(configContent, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": 'attachment; filename="warp_config.txt"'
        }
      });
    } catch (error) {
      return new Response(`Error generating config: ${(error as Error).message}`, { status: 500 });
    }
  }
};

async function fetchIPData(): Promise<IPData> {
  try {
    const response = await fetch("https://raw.githubusercontent.com/ircfspace/endpoint/refs/heads/main/ip.json");
    if (!response.ok) throw new Error("Failed to fetch IP data");
    return await response.json() as IPData;
  } catch (error) {
    return {
      "ipv4": ["162.159.192.23:859", "162.159.192.178:4500"],
      "ipv6": ["[2606:4700:d1::9f62:b405:88e4:858e]:7152"]
    };
  }
}
__name(fetchIPData, "fetchIPData");

function generateConfig(ipData: IPData): string {
  const template = `//profile-title: base64:8J+RvUFub255bW91cy1XQVJQLVBybw==
//profile-update-interval: 1
//subscription-userinfo: upload=0; download=0; total=10737418240000000; expire=2546249531
//support-url: https://t.me/BXAMbot
//profile-web-page-url: https://github.com/4n0nymou3
`;
  const ipv4List = shuffleArray(ipData.ipv4).slice(0, 2);
  const ipv6 = shuffleArray(ipData.ipv6)[0];
  const configs = [
    generateConfigEntry(ipv4List[0], 1, "IPv4"),
    generateConfigEntry(ipv4List[1], 2, "IPv4"),
    generateConfigEntry(ipv6, 3, "IPv6")
  ];
  return template + "\n" + configs.join("\n\n");
}
__name(generateConfig, "generateConfig");

function generateConfigEntry(ipPort: string, index: number, ipVersion: string): string {
  return `warp://${ipPort}/?ifp=50-100&ifps=50-100&ifpd=3-6&ifpm=m4&&detour=warp://${ipPort}/?ifp=50-100&ifps=50-100&ifpd=3-6&ifpm=m4#Anon-WoW-${ipVersion}\u{1F1E9}\u{1F1EA}-${index}`;
}
__name(generateConfigEntry, "generateConfigEntry");

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
__name(shuffleArray, "shuffleArray");

export default worker_default;