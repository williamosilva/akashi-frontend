export const codeSnippetJavaScript = `
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">axios</span> <span class="text-[#ff79c6]">from</span> <span class="text-[#f1fa8c]">'axios'</span><span class="text-[#f8f8f2]">;</span>

<span class="text-[#50fa7b]">async function</span> <span class="text-[#8be9fd]">getProjectData</span><span class="text-[#f8f8f2]">() {</span>
 <span class="text-[#ff79c6]">try</span> <span class="text-[#f8f8f2]">{</span>
   <span class="text-[#ff79c6]">const</span> <span class="text-[#f8f8f2]">response = </span><span class="text-[#ff79c6]">await</span> <span class="text-[#f8f8f2]">axios.get(</span><span class="text-[#f1fa8c]">\Your-akashi-private-link\</span><span class="text-[#f8f8f2]">);</span>
   <span class="text-[#ff79c6]">const</span> <span class="text-[#f8f8f2]">yourData = response.data;</span>
   <span class="text-[#ff79c6]">return</span> <span class="text-[#f8f8f2]">yourData;</span>
 <span class="text-[#f8f8f2]">} </span><span class="text-[#ff79c6]">catch</span> <span class="text-[#f8f8f2]">(error) {</span>
   <span class="text-[#f8f8f2]">console.error(</span><span class="text-[#f1fa8c]">'Error fetching project data:'</span><span class="text-[#f8f8f2]">, error);</span>
   <span class="text-[#ff79c6]">throw</span> <span class="text-[#f8f8f2]">error;</span>
 <span class="text-[#f8f8f2]">}</span>
<span class="text-[#f8f8f2]">}</span>

<span class="text-[#6272a4]">// Usage</span>
<span class="text-[#f8f8f2]">getProjectData()</span>
 <span class="text-[#f8f8f2]">.then(</span><span class="text-[#ffb86c]">yourData</span> <span class="text-[#ff79c6]">=></span> <span class="text-[#f8f8f2]">console.log(</span><span class="text-[#f1fa8c]">'Your Data:'</span><span class="text-[#f8f8f2]">, yourData))</span>
 <span class="text-[#f8f8f2]">.catch(</span><span class="text-[#ffb86c]">error</span> <span class="text-[#ff79c6]">=></span> <span class="text-[#f8f8f2]">console.error(</span><span class="text-[#f1fa8c]">'Error:'</span><span class="text-[#f8f8f2]">, error.message));</span>

<span class="text-[#6272a4]">/* Example response:
{
 "Project Name": {
   "userList": [...],
   "apiIntegration": {...},
   "dataExample": {...}
 }
}
*/</span>
`;

export const codeSnippetPython = `
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">requests</span>
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">json</span>

<span class="text-[#6272a4]"># Simple function to search for project data</span>
<span class="text-[#50fa7b]">def</span> <span class="text-[#8be9fd]">get_project_data</span><span class="text-[#f8f8f2]">():</span>
    <span class="text-[#ff79c6]">try</span><span class="text-[#f8f8f2]">:</span>
        <span class="text-[#f8f8f2]">response = requests.get(</span><span class="text-[#f1fa8c]">"Your-akashi-private-link"</span><span class="text-[#f8f8f2]">)</span>
        <span class="text-[#f8f8f2]">response.raise_for_status()</span>
        <span class="text-[#f8f8f2]">data = response.json()</span>
        <span class="text-[#ff79c6]">return</span> <span class="text-[#f8f8f2]">data</span>
    <span class="text-[#ff79c6]">except</span> <span class="text-[#f8f8f2]">Exception</span> <span class="text-[#ff79c6]">as</span> <span class="text-[#f8f8f2]">error:</span>
        <span class="text-[#f8f8f2]">print(</span><span class="text-[#f1fa8c]">f"Error fetching project data: {error}"</span><span class="text-[#f8f8f2]">)</span>
        <span class="text-[#ff79c6]">raise</span> <span class="text-[#f8f8f2]">error</span>

<span class="text-[#6272a4]"># Main use</span>
<span class="text-[#ff79c6]">if</span> <span class="text-[#f8f8f2]">__name__ == </span><span class="text-[#f1fa8c]">"__main__"</span><span class="text-[#f8f8f2]">:</span>
    <span class="text-[#ff79c6]">try</span><span class="text-[#f8f8f2]">:</span>
        <span class="text-[#f8f8f2]">data = get_project_data()</span>
        <span class="text-[#f8f8f2]">print(</span><span class="text-[#f1fa8c]">f"Your Data: {json.dumps(data, indent=2)}"</span><span class="text-[#f8f8f2]">)</span>
    <span class="text-[#ff79c6]">except</span> <span class="text-[#f8f8f2]">Exception</span> <span class="text-[#ff79c6]">as</span> <span class="text-[#f8f8f2]">error:</span>
        <span class="text-[#f8f8f2]">print(</span><span class="text-[#f1fa8c]">f"Error: {str(error)}"</span><span class="text-[#f8f8f2]">)</span>

<span class="text-[#6272a4]">"""
Example response:
{
  "Project Name": {
    "userList": [...],
    "apiIntegration": {...},
    "dataExample": {...}
  }
}
"""</span>
`;

export const codeSnippetJava = `
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">java.net.URI;</span>
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">java.net.http.HttpClient;</span>
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">java.net.http.HttpRequest;</span>
<span class="text-[#ff79c6]">import</span> <span class="text-[#f8f8f2]">java.net.http.HttpResponse;</span>

<span class="text-[#50fa7b]">public class</span> <span class="text-[#8be9fd]">ProjectDataFetcher</span> <span class="text-[#f8f8f2]">{</span>
    
    <span class="text-[#ff79c6]">public static</span> <span class="text-[#f8f8f2]">String</span> <span class="text-[#8be9fd]">getProjectData</span><span class="text-[#f8f8f2]">() {</span>
        <span class="text-[#ff79c6]">try</span> <span class="text-[#f8f8f2]">{</span>
            <span class="text-[#f8f8f2]">HttpClient client = HttpClient.newHttpClient();</span>
            <span class="text-[#f8f8f2]">HttpRequest request = HttpRequest.newBuilder()</span>
                    <span class="text-[#f8f8f2]">.uri(URI.create(</span><span class="text-[#f1fa8c]">"Your-akashi-private-link"</span><span class="text-[#f8f8f2]">))</span>
                    <span class="text-[#f8f8f2]">.build();</span>
                    
            <span class="text-[#f8f8f2]">HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());</span>
            <span class="text-[#ff79c6]">return</span> <span class="text-[#f8f8f2]">response.body();</span>
        <span class="text-[#f8f8f2]">} </span><span class="text-[#ff79c6]">catch</span> <span class="text-[#f8f8f2]">(Exception e) {</span>
            <span class="text-[#f8f8f2]">System.err.println(</span><span class="text-[#f1fa8c]">"Error fetching project data: "</span> <span class="text-[#f8f8f2]">+ e.getMessage());</span>
            <span class="text-[#ff79c6]">throw new</span> <span class="text-[#f8f8f2]">RuntimeException(e);</span>
        <span class="text-[#f8f8f2]">}</span>
    <span class="text-[#f8f8f2]">}</span>
    
    <span class="text-[#ff79c6]">public static void</span> <span class="text-[#8be9fd]">main</span><span class="text-[#f8f8f2]">(String[] args) {</span>
        <span class="text-[#ff79c6]">try</span> <span class="text-[#f8f8f2]">{</span>
            <span class="text-[#f8f8f2]">String data = getProjectData();</span>
            <span class="text-[#f8f8f2]">System.out.println(</span><span class="text-[#f1fa8c]">"Your Data: "</span> <span class="text-[#f8f8f2]">+ data);</span>
        <span class="text-[#f8f8f2]">} </span><span class="text-[#ff79c6]">catch</span> <span class="text-[#f8f8f2]">(Exception e) {</span>
            <span class="text-[#f8f8f2]">System.err.println(</span><span class="text-[#f1fa8c]">"Error: "</span> <span class="text-[#f8f8f2]">+ e.getMessage());</span>
        <span class="text-[#f8f8f2]">}</span>
    <span class="text-[#f8f8f2]">}</span>
    
    <span class="text-[#6272a4]">/* Example response:
    {
      "Project Name": {
        "userList": [...],
        "apiIntegration": {...},
        "dataExample": {...}
      }
    }
    */</span>
<span class="text-[#f8f8f2]">}</span>
`;
