import json
import os
from pathlib import Path

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

_rag_chain = None


def _load_documents(data_path: Path) -> list[Document]:
    with data_path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    docs = []
    for item in data:
        content = f"Career: {item['career_name']} ({item['domain']})\n"
        content += f"Description: {item['brief_description']}\n"
        content += f"Ideal Traits: Holland {item['psychometrics_profile']['holland_codes']}, Big Five: {item['psychometrics_profile']['big_five_traits']}\n"
        content += "Bloom's Competency Requirements:\n"
        for bloom in item["bloom_competency_requirements"]:
            content += f"- Skill: {bloom['skill']} (Level {bloom['level']} - {bloom['bloom_stage']}): {bloom['description']}\n"
        content += (
            "Salary Range: "
            f"Fresher {item['market_data_vietnam']['salary_range_vnd_monthly']['fresher_under_1_year']}, "
            f"Senior {item['market_data_vietnam']['salary_range_vnd_monthly']['senior_over_5_years']}\n"
        )
        ugly_truth = item.get("the_ugly_truth", "No additional notes")
        if isinstance(ugly_truth, list):
            ugly_truth = " ".join(ugly_truth)
        content += f"The Ugly Truth: {ugly_truth}\n"
        references = item.get("source_references", [])
        if references:
            content += "References:\n"
            for ref in references:
                content += f"- {ref.get('title', 'Unknown source')}: {ref.get('url', '')}\n"
        docs.append(Document(page_content=content, metadata={"career_id": item["career_id"]}))

    return docs


def get_rag_chain():
    global _rag_chain

    if _rag_chain is not None:
        return _rag_chain

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GOOGLE_API_KEY environment variable")

    os.environ["GOOGLE_API_KEY"] = api_key

    base_dir = Path(__file__).resolve().parent
    data_path = base_dir / "data.standard.json"
    if not data_path.exists():
        data_path = base_dir / "data.json"
    if not data_path.exists():
        raise RuntimeError(f"Missing data file: {data_path}")

    docs = _load_documents(data_path)

    embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
    vectorstore = Chroma.from_documents(documents=docs, embedding=embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.5)

    system_prompt = (
        "You are an empathetic, insightful, and highly skilled Career Advisor, you can call yourself in various ways, but you want the person talking to you have a close feeling, you can be a friend, a higher grade student or the one has experience alot, you have to follow with the user to refer to oneself, and working for the CareerGraph system. "
        "Your goal is to guide high school students through their career choices like a friendly, experienced mentor.\n\n"
        "HOW TO HANDLE THE CONVERSATION (HANDLING NOISE):\n"
        "1. Be Human First: If the user vents, shares personal stress, or talks about off-topic things, validate their feelings first.\n"
        "2. Graceful Pivot: After validating, gently steer the conversation back to discovering their potential using our career framework.\n"
        "3. Conversational Tone: Do not just spit out data blocks. Weave the data naturally into your advice.\n\n"
        "YOUR CORE ANALYSIS (THE 3 AXES):\n"
        "When advising on specific careers, you must use the context provided below:\n"
        "- Axis 1: Personality (Holland/Big Five).\n"
        "- Axis 2: Cognitive Level (Bloom's Taxonomy).\n"
        "- Axis 3: Reality Check (Market Data + The Ugly Truth).\n\n"
        "STRICT RULES:\n"
        "- Use the context strictly for factual data about specific careers.\n"
        "- You can use general knowledge for psychological support and explanation.\n"
        "- If asked about careers not in context, mention that current deep dataset focuses on Tech & Biz.\n"
        "- Always respond in natural, friendly Vietnamese.\n"
        "- Always end with one guiding question.\n\n"
        "CONTEXT:\n{context}"
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )

    # Build simple RAG chain without deprecated create_stuff_documents_chain
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
    )
    
    _rag_chain = rag_chain
    return _rag_chain
