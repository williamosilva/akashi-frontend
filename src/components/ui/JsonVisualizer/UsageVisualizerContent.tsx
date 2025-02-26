import React, { useState } from "react";
import Image from "next/image";
import { jetbrainsMono } from "@/styles/fonts";

type ProgrammingLanguage = "typescript" | "python" | "java";

interface Props {
  apiUrl: string;
}

// Componente para um token de código individual
const CodeToken = ({ type, children }) => {
  const getTokenClass = () => {
    switch (type) {
      case "keyword":
        return "text-emerald-300 "; // palavras-chave
      case "function":
        return "text-emerald-200"; // funções
      case "string":
        return "text-emerald-300 italic"; // strings
      case "comment":
        return "text-emerald-200/70 italic"; // comentários
      case "type":
        return "text-emerald-300 font-medium"; // tipos
      case "variable":
        return "text-emerald-200 font-light"; // variáveis
      case "constant":
        return "text-emerald-300 font-medium"; // constantes
      default:
        return "text-emerald-200/90"; // texto padrão
    }
  };

  return <span className={`${getTokenClass()} break-words`}>{children}</span>;
};

// Componente para renderizar uma linha de código com tokens
const CodeLine = ({ line, language }) => {
  if (language === "typescript") {
    // Tokenização para TypeScript
    const tokens = [];
    let index = 0;

    // Array de padrões e seus tipos correspondentes
    const patterns = [
      {
        regex:
          /(const|let|var|async|await|try|catch|return|import|from|export)(\s|$)/g,
        type: "keyword",
      },
      {
        regex: /(console\.log|console\.error|fetch|\.json\(\))/g,
        type: "function",
      },
      { regex: /('.*?'|".*?"|\`.*?\`)/g, type: "string" },
      { regex: /(\/\/.*)/g, type: "comment" },
      { regex: /\b(FC|Props|React|ProgrammingLanguage)\b/g, type: "type" },
      {
        regex: /\b(fetchData|jsonData|response|error|data|activeLanguage)\b/g,
        type: "variable",
      },
    ];

    // Dividir a linha em palavras para análise
    const words = line.split(/(\s+|[(){};,.])/);

    return (
      <div className="leading-relaxed break-words w-full">
        {words.map((word, idx) => {
          // Verificar cada padrão
          for (const { regex, type } of patterns) {
            if (word.match(regex)) {
              return (
                <CodeToken key={idx} type={type}>
                  {word}
                </CodeToken>
              );
            }
          }
          // Se não corresponder a nenhum padrão, retornar o texto como está
          return (
            <span key={idx} className="text-emerald-200/90 break-words">
              {word}
            </span>
          );
        })}
      </div>
    );
  } else if (language === "python") {
    // Tokenização para Python (abordagem similar ao TypeScript)
    const words = line.split(/(\s+|[(){};,.])/);

    return (
      <div className="leading-relaxed">
        {words.map((word, idx) => {
          if (
            /\b(import|from|def|try|except|return|as|if|else|print|for|in|while)\b/.test(
              word
            )
          ) {
            return (
              <CodeToken key={idx} type="keyword">
                {word}
              </CodeToken>
            );
          } else if (
            /\b(requests\.get|raise_for_status|json|print)\b/.test(word)
          ) {
            return (
              <CodeToken key={idx} type="function">
                {word}
              </CodeToken>
            );
          } else if (/('.*?'|".*?")/.test(word)) {
            return (
              <CodeToken key={idx} type="string">
                {word}
              </CodeToken>
            );
          } else if (/(#.*)/.test(word)) {
            return (
              <CodeToken key={idx} type="comment">
                {word}
              </CodeToken>
            );
          } else if (/\b(response|json_data|data|e)\b/.test(word)) {
            return (
              <CodeToken key={idx} type="variable">
                {word}
              </CodeToken>
            );
          }
          return (
            <span key={idx} className="text-emerald-200/90 break-words">
              {word}
            </span>
          );
        })}
      </div>
    );
  } else if (language === "java") {
    // Tokenização para Java (abordagem similar)
    const words = line.split(/(\s+|[(){};,.])/);

    return (
      <div className="leading-relaxed">
        {words.map((word, idx) => {
          if (
            /\b(public|private|protected|static|class|void|try|catch|new|return|throws|import|package)\b/.test(
              word
            )
          ) {
            return (
              <CodeToken key={idx} type="keyword">
                {word}
              </CodeToken>
            );
          } else if (
            /\b(StringBuilder|String|HttpURLConnection|URL|BufferedReader|InputStreamReader|Exception)\b/.test(
              word
            )
          ) {
            return (
              <CodeToken key={idx} type="type">
                {word}
              </CodeToken>
            );
          } else if (
            /\b(fetchData|openConnection|setRequestMethod|getInputStream|readLine|append|close|getMessage|main)\b/.test(
              word
            )
          ) {
            return (
              <CodeToken key={idx} type="function">
                {word}
              </CodeToken>
            );
          } else if (/(".*?")/.test(word)) {
            return (
              <CodeToken key={idx} type="string">
                {word}
              </CodeToken>
            );
          } else if (
            /\b(url|conn|reader|response|line|data|args|e)\b/.test(word)
          ) {
            return (
              <CodeToken key={idx} type="variable">
                {word}
              </CodeToken>
            );
          }
          return (
            <span key={idx} className="text-emerald-200/90 break-words">
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  // Se nenhuma linguagem for reconhecida, retornar a linha como está
  return <div className="text-emerald-200">{line}</div>;
};

// Componente principal para syntax highlighting
const CodeBlock = ({ code, language }) => {
  const lines = code.split("\n");

  return (
    <pre
      className={`text-emerald-200 whitespace-pre-wrap max-w-full ${jetbrainsMono.className}`}
    >
      {lines.map((line, idx) => (
        <CodeLine key={idx} line={line} language={language} />
      ))}
    </pre>
  );
};

export const UsageVisualizerContent = ({ apiUrl }: Props) => {
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
    <div className="mb-0">
      <div className="flex flex-wrap gap-3 pb-4">
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

      {/* Container de código com o syntax highlighter */}
      <div className="bg-zinc-800 p-6 rounded-lg w-full overflow-x-auto">
        <CodeBlock
          code={codeExamples[activeLanguage]}
          language={activeLanguage}
        />
      </div>
    </div>
  );
};

export default UsageVisualizerContent;
