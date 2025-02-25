import { JSX, useState } from "react";
import Image from "next/image";

type ProgrammingLanguage = "typescript" | "python" | "java";

interface Props {
  apiUrl: string;
}

export const UsageVisualizerContent: React.FC<Props> = ({ apiUrl }) => {
  const [activeLanguage, setActiveLanguage] =
    useState<ProgrammingLanguage>("typescript");

  const codeExamples = {
    typescript: `const fetchData = async () => {
  try {
    const response = await fetch('${apiUrl}');
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};


const data = await fetchData();`,

    python: `import requests

def get_data():
    try:
        response = requests.get('${apiUrl}')
        response.raise_for_status()
        json_data = response.json()
        return json_data
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição: {e}")

# Uso
data = get_data()`,

    java: `import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ApiClient {
    public static String fetchData() {
        try {
            URL url = new URL("${apiUrl}");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            return response.toString();
        } catch (Exception e) {
            System.out.println("Erro na requisição: " + e.getMessage());
            return null;
        }
    }
    

    public static void main(String[] args) {
        String data = fetchData();
    }
}`,
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3 pb-4">
        {/* Botões de seleção de linguagem (mesmo código fornecido) */}
        <div className="relative group">
          <button
            onClick={() => setActiveLanguage("typescript")}
            className={`inline-flex items-center gap-2 rounded-lg border p-2 text-sm font-medium transition-colors ${
              activeLanguage === "typescript"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-input bg-[#131314] text-emerald-300/80 hover:bg-emerald-500/5 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <div className="w-auto h-auto rounded-sm overflow-hidden">
              <Image
                src="/images/typescript_icon.png"
                alt="TypeScript"
                width={20}
                height={20}
                className="select-none"
              />
            </div>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => setActiveLanguage("python")}
            className={`inline-flex items-center gap-2 rounded-lg border p-2 text-sm font-medium transition-colors ${
              activeLanguage === "python"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-input bg-[#131314] text-emerald-300/80 hover:bg-emerald-500/5 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <div className="w-auto h-auto rounded-sm overflow-hidden">
              <Image
                src="/images/python_icon.webp"
                alt="Python"
                width={20}
                height={20}
                className="select-none"
              />
            </div>
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={() => setActiveLanguage("java")}
            className={`inline-flex items-center gap-2 rounded-lg border p-2 justify-center text-sm font-medium transition-colors ${
              activeLanguage === "java"
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "border-input bg-[#131314] text-emerald-300/80 hover:bg-emerald-500/5 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <div className="w-5 h-5 rounded-sm overflow-hidden bg-white flex justify-center items-center">
              <Image
                src="/images/java_icon.png"
                alt="Java"
                width={14.9}
                height={20}
                className="select-none"
              />
            </div>
          </button>
        </div>
      </div>
      <div className="bg-zinc-800 p-4 rounded-lg">
        <pre className="text-emerald-200 whitespace-pre-wrap">
          {codeExamples[activeLanguage]}
        </pre>
      </div>
    </div>
  );
};

export default UsageVisualizerContent;
