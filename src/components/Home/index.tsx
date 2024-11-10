import "./styles.css";
import { useState } from "react";
import axios from "axios";

export const Home = () => {
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const [hasPdf, setHasPdf] = useState(false);

    const handleInputChange = (event: any) => {
        setText(event.target.value);
        event.target.style.height = "auto"; // Redefine a altura para recalcular
        event.target.style.height = `${event.target.scrollHeight}px`; // Ajusta a altura conforme o conteúdo
    };

    const postPrompt = async () => {
        try {
            const result = await axios.post("http://localhost:8000/v1/training/gpt-prompt", {
                prompt: text,
            });

            setResponse(result?.data?.msg);
            setHasPdf(true);
        } catch (error) {
            console.error("Erro ao enviar o prompt:", error);
        }
    };

    const downloadPdf = async () => {
        try {
            const result = await axios.get("http://localhost:8000/v1/training/gpt-prompt", {
                responseType: 'blob',
            });

            // Cria um link para download do PDF
            const url = window.URL.createObjectURL(new Blob([result.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'treino.pdf');
            document.body.appendChild(link);
            link.click();
            // link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Erro ao baixar o PDF:", error);
        }
    };

    return (
        <div className="container">
            {!hasPdf ? (
                <>
                    <h1>Digite aqui o que você deseja:</h1>
                    <textarea
                        value={text}
                        onChange={handleInputChange}
                        placeholder="Digite algo..."
                    />
                    <button onClick={postPrompt}>Enviar</button>
                    {response && (
                        <div className="response">
                            <h2>Resposta da API:</h2>
                            <p>{response}</p>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <button onClick={downloadPdf}>Baixar PDF</button>
                </div>
            )}
        </div>
    );
};
