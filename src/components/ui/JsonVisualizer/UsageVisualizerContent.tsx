import React, { useState } from "react";
import Image from "next/image";
import { jetbrainsMono } from "@/styles/fonts";
import { Tooltip, TooltipProvider } from "../Utils/Tooltip";
import { Button } from "../Utils/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgrammingLanguage = "typescript" | "python" | "java";

interface Props {
  apiUrl: string | null;
}

interface CodeTokenProps {
  type: string;
  children: string;
}

interface CodeLineProps {
  line: string;
  language: ProgrammingLanguage;
}

interface CodeBlockProps {
  code: string;
  language: ProgrammingLanguage;
}

interface CopyButtonProps {
  textToCopy: string;
}

const CodeToken = ({ type, children }: CodeTokenProps) => {
  const getTokenClass = () => {
    switch (type) {
      case "keyword":
        return "text-emerald-300 ";
      case "function":
        return "text-emerald-200";
      case "string":
        return "text-emerald-300 italic";
      case "comment":
        return "text-emerald-200/70 italic";
      case "type":
        return "text-emerald-300 font-medium";
      case "variable":
        return "text-emerald-200 font-light";
      case "constant":
        return "text-emerald-300 font-medium";
      default:
        return "text-emerald-200/90";
    }
  };

  return <span className={`${getTokenClass()} break-words`}>{children}</span>;
};

const CopyButton = ({ textToCopy }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar: ", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip
        content="Click to copy"
        position="top"
        className="absolute right-4 top-4"
      >
        <Button
          variant="outline"
          size="icon"
          className="disabled:opacity-100 bg-[#1c1c1d9f]"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
          disabled={copied}
        >
          <div
            className={cn(
              "transition-all",
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          >
            <Check
              className="stroke-emerald-500"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <div
            className={cn(
              "absolute transition-all",
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <Copy size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </Button>
      </Tooltip>
    </TooltipProvider>
  );
};

const CodeLine = ({ line, language }: CodeLineProps) => {
  if (language === "typescript") {
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

    const words = line.split(/(\s+|[(){};,.])/);

    return (
      <div className="leading-relaxed break-words w-full">
        {words.map((word, idx) => {
          for (const { regex, type } of patterns) {
            if (word.match(regex)) {
              return (
                <CodeToken key={idx} type={type}>
                  {word}
                </CodeToken>
              );
            }
          }

          return (
            <span key={idx} className="text-emerald-200/90 break-words">
              {word}
            </span>
          );
        })}
      </div>
    );
  } else if (language === "python") {
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

  return <div className="text-emerald-200">{line}</div>;
};

const CodeBlock = ({ code, language }: CodeBlockProps) => {
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
  try {q
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

      <div className="bg-zinc-800 p-6 rounded-lg w-full overflow-x-auto relative">
        <CopyButton textToCopy={codeExamples[activeLanguage]} />
        <CodeBlock
          code={codeExamples[activeLanguage]}
          language={activeLanguage}
        />
      </div>
    </div>
  );
};

export default UsageVisualizerContent;
