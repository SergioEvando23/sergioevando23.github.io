from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "documents"
REGULAR_FONT = "C:/Windows/Fonts/arial.ttf"
BOLD_FONT = "C:/Windows/Fonts/arialbd.ttf"

pdfmetrics.registerFont(TTFont("Resume", REGULAR_FONT))
pdfmetrics.registerFont(TTFont("Resume-Bold", BOLD_FONT))


CERTIFICATES_PT = [
    ("Engenharia de Prompts com IA: Do Zero ao Avançado", "Udemy", "set. de 2026", "UC-783d4a69-045e-45f0-b7d3-644e776f9edd"),
    ("Inteligência artificial do zero ao avançado", "Udemy", "set. de 2026", "UC-77eff13e-22d0-48e3-a734-f4f44348c5af"),
    ("Trilha de Desenvolvimento full cycle", "XP Inc.", "mai. de 2024", "136977"),
    ("Security Champions - Aplicação segura", "Gopliance", "out. de 2025", None),
    ("Desenvolvimento de web fullstack", "Trybe", "out. de 2021", "1f04fdd7f3582a43dc625102d77b7456f4ce91ac"),
    ("Módulo - Ciência da Computação", "Trybe", "fev. de 2023", "68960443"),
    ("TypeScript do básico ao avançado", "Udemy", "dez. de 2022", "UC-457d5de7-1403-4148-9562-3ced1601ca3a"),
    ("HTML e CSS Essencial - Front End", "Udemy", "out. de 2022", "UC-e50e3e04-f6e9-4522-9be0-b091df0785e6"),
    ("HTML5 e CSS3 avançado com flexbox", "Udemy", "set. de 2022", "UC-7b510870-c534-40d2-9c5a-2e42319ebe57"),
    ("Módulo - Desenvolvimento web back-end", "Trybe", "set. de 2022", "c11a569a-bec9-4416-9691-e863211"),
    ("Desenvolvimento Web Moderno com Javascript", "Cod3r", "set. de 2022", "UC-619686a0-ab23-4d0e-b94a-28bb9d838937"),
    ("Módulo - Desenvolvimento web front-end", "Trybe", "mai. de 2022", "50599272"),
    ("Módulo - Fundamentos do Desenvolvimento Web", "Trybe", "fev. de 2022", "46240271"),
    ("Javascript com Testing Driving Development", "Udemy", "out. de 2020", "UC-1e9190fb-1633-4a4b-9886-a9edd5b282e3"),
]

CERTIFICATES_EN = [
    ("Prompt Engineering with AI: From Zero to Advanced", "Udemy", "Sep. 2026", "UC-783d4a69-045e-45f0-b7d3-644e776f9edd"),
    ("Artificial Intelligence: From Zero to Advanced", "Udemy", "Sep. 2026", "UC-77eff13e-22d0-48e3-a734-f4f44348c5af"),
    ("Full Cycle Development Track", "XP Inc.", "May 2024", "136977"),
    ("Security Champions - Secure application", "Gopliance", "Oct. 2025", None),
    ("Full Stack Web Development", "Trybe", "Oct. 2021", "1f04fdd7f3582a43dc625102d77b7456f4ce91ac"),
    ("Computer Science Module", "Trybe", "Feb. 2023", "68960443"),
    ("TypeScript from Basic to Advanced", "Udemy", "Dec. 2022", "UC-457d5de7-1403-4148-9562-3ced1601ca3a"),
    ("Essential HTML and CSS - Front End", "Udemy", "Oct. 2022", "UC-e50e3e04-f6e9-4522-9be0-b091df0785e6"),
    ("Advanced HTML5 and CSS3 with Flexbox", "Udemy", "Sep. 2022", "UC-7b510870-c534-40d2-9c5a-2e42319ebe57"),
    ("Back-end Web Development Module", "Trybe", "Sep. 2022", "c11a569a-bec9-4416-9691-e863211"),
    ("Modern Web Development with JavaScript", "Cod3r", "Sep. 2022", "UC-619686a0-ab23-4d0e-b94a-28bb9d838937"),
    ("Front-end Web Development Module", "Trybe", "May 2022", "50599272"),
    ("Web Development Fundamentals Module", "Trybe", "Feb. 2022", "46240271"),
    ("JavaScript with Testing Driving Development", "Udemy", "Oct. 2020", "UC-1e9190fb-1633-4a4b-9886-a9edd5b282e3"),
]


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle("name", parent=base["Normal"], fontName="Resume-Bold", fontSize=23, leading=26, textColor=colors.HexColor("#102A43")),
        "contact": ParagraphStyle("contact", parent=base["Normal"], fontName="Resume", fontSize=8.7, leading=14, textColor=colors.HexColor("#486581")),
        "section": ParagraphStyle("section", parent=base["Normal"], fontName="Resume-Bold", fontSize=11.5, leading=15, spaceBefore=13, spaceAfter=6, textColor=colors.HexColor("#007C91")),
        "body": ParagraphStyle("body", parent=base["Normal"], fontName="Resume", fontSize=9.1, leading=15, spaceAfter=5, textColor=colors.HexColor("#243B53"), alignment=TA_LEFT),
        "skills": ParagraphStyle("skills", parent=base["Normal"], fontName="Resume", fontSize=8.1, leading=10.3, spaceAfter=2, textColor=colors.HexColor("#243B53"), alignment=TA_LEFT),
        "role": ParagraphStyle("role", parent=base["Normal"], fontName="Resume-Bold", fontSize=9.6, leading=14, textColor=colors.HexColor("#102A43")),
        "meta": ParagraphStyle("meta", parent=base["Normal"], fontName="Resume", fontSize=8.2, leading=12, textColor=colors.HexColor("#627D98")),
        "cert": ParagraphStyle("cert", parent=base["Normal"], fontName="Resume", fontSize=8, leading=11, textColor=colors.HexColor("#243B53"), spaceAfter=4),
        "footer": ParagraphStyle("footer", parent=base["Normal"], fontName="Resume", fontSize=7.2, textColor=colors.HexColor("#829AB1")),
    }


def on_page(canvas, document):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D9E2EC"))
    canvas.setLineWidth(0.5)
    canvas.line(document.leftMargin, 13 * mm, A4[0] - document.rightMargin, 13 * mm)
    canvas.setFont("Resume", 7.2)
    canvas.setFillColor(colors.HexColor("#829AB1"))
    canvas.drawString(document.leftMargin, 8.4 * mm, "Sergio Costa")
    canvas.drawRightString(A4[0] - document.rightMargin, 8.4 * mm, f"Page {document.page}")
    canvas.restoreState()


def section(story, text, s):
    story.extend([Paragraph(text, s["section"]), HRFlowable(width="100%", thickness=0.55, color=colors.HexColor("#D9E2EC"), spaceAfter=5)])


def experience(story, s, role, dates, bullets):
    story.append(Paragraph(role, s["role"]))
    story.append(Paragraph(dates, s["meta"]))
    for bullet in bullets:
        story.append(Paragraph(f"- {bullet}", s["body"]))
    story.append(Spacer(1, 6))


def build_resume(filename, language):
    is_pt = language == "pt"
    s = styles()
    doc = SimpleDocTemplate(
        str(OUTPUT_DIR / filename), pagesize=A4,
        rightMargin=16 * mm, leftMargin=16 * mm, topMargin=15 * mm, bottomMargin=19 * mm,
        title="Curriculo Sergio Costa" if is_pt else "Sergio Costa Resume",
        author="Sergio Costa",
    )
    story = [
        Paragraph("Sergio Costa", s["name"]),
        Spacer(1, 2),
        Paragraph("workbysergiocosta@gmail.com | linkedin.com/in/sergiocosta23 | github.com/sergioevando23 |<br/>sergioevando23.github.io | Telefone e WhatsApp +55 81 99880-0238", s["contact"]),
        Spacer(1, 6),
    ]

    if is_pt:
        section(story, "Resumo", s)
        for summary in [
            "Engenheiro de Software com experiência comprovada construindo aplicações web e mobile em ambientes de alta escala.",
            "Especializado em React e TypeScript, com experiência na definição de arquiteturas escaláveis como micro-frontends, priorizando performance, manutenibilidade e evolução contínua.",
            "Experiência com testes automatizados (unitários, integração e E2E), qualidade de código e boas práticas de engenharia.",
            "Atuação com APIs REST e GraphQL, além de desenvolvimento mobile utilizando Flutter (Dart) ou React Native (TypeScript).",
            "Perfil orientado à resolução de problemas, com forte senso de responsabilidade e foco em gerar impacto técnico real e qualitativo.",
        ]:
            story.append(Paragraph(summary, s["body"]))
        section(story, "Experiência", s)
        experience(story, s, "XP Inc. - Engenheiro de Software Fullstack Web & Mobile", "Set. 2022 - Out. 2026 | Brasil", ["Desenvolvimento e manutenção de aplicações web escaláveis utilizando React e TypeScript, além de aplicações mobile com Flutter.", "Contribuição em decisões arquiteturais, incluindo adoção de micro-frontends.", "Criação e implementação de testes automatizados (unitários, integração e E2E).", "Realização de code reviews e promoção de boas práticas de engenharia.", "Mentoria e onboarding de novos engenheiros, acelerando sua adaptação.", "Atuação na resolução de incidentes em produção e melhoria da estabilidade dos sistemas.", "Monitoramento de aplicações utilizando Dynatrace.", "Gestão de releases com uso de feature flags (Firebase).", "Evolução contínua dos processos de desenvolvimento e qualidade de código."])
        experience(story, s, "Eduardo Costa Software Solutions - Desenvolvedor de Software", "Fev. 2021 - Jul. 2021 | Brasil", ["Desenvolvimento e evolução de aplicações frontend com React e TypeScript.", "Criação de componentes reutilizáveis e melhoria da estrutura do código para escalabilidade.", "Integração com APIs REST e colaboração com times backend.", "Identificação e correção de bugs, melhorando estabilidade e experiência do usuário.", "Análise de performance e implementação de otimizações.", "Participação em decisões técnicas e evolução da base de código.", "Colaboração com times multidisciplinares para entrega de funcionalidades orientadas ao negócio."])
        story.append(PageBreak())
        section(story, "Formação Acadêmica", s)
        story.append(Paragraph("Bacharelado em Engenharia de Software - Estácio (2025 - 2029)", s["body"]))
        section(story, "Habilidades Técnicas", s)
        for line in ["Frontend: React, Next.js, TypeScript, Tailwind CSS, Angular, Styled Components, SASS, HTML5, CSS3, Redux, Recoil, Context.js, Webpack, Zustand, Jotai", "Mobile: Flutter, Dart, React Native, TypeScript", "Backend: Node.js, MySQL, PostgreSQL, MongoDB, Redis, Docker, AWS, Serverless, REST APIs, RESTful APIs", "Observabilidade: Datadog, Grafana, Dynatrace", "Testes: Unitários, E2E, Integração, Carga, Sintéticos"]:
            story.append(Paragraph(line, s["skills"]))
        certificates = CERTIFICATES_PT
        certificate_title = "Certificações"
        credential_label = "Código da credencial"
        issued_label = "emitido"
    else:
        section(story, "Summary", s)
        for summary in [
            "Software Engineer with proven experience building web and mobile applications in high-scale environments.",
            "Specialized in React and TypeScript, with experience defining scalable architectures such as micro-frontends, prioritizing performance, maintainability, and continuous evolution.",
            "Experienced with automated testing (unit, integration, and E2E), code quality, and engineering best practices.",
            "Works with REST and GraphQL APIs, in addition to mobile development using Flutter (Dart) or React Native (TypeScript).",
            "Problem-solving oriented, with a strong sense of ownership and focus on delivering meaningful, high-quality technical impact.",
        ]:
            story.append(Paragraph(summary, s["body"]))
        section(story, "Experience", s)
        experience(story, s, "XP Inc. - Fullstack Web & Mobile Software Engineer", "Sep. 2022 - Oct. 2026 | Brazil", ["Developed and maintained scalable web applications using React and TypeScript, as well as mobile applications with Flutter.", "Contributed to architectural decisions, including the adoption of micro-frontends.", "Created and implemented automated tests (unit, integration, and E2E).", "Conducted code reviews and promoted engineering best practices.", "Mentored and onboarded new engineers, accelerating their ramp-up.", "Resolved production incidents and improved system stability.", "Monitored applications using Dynatrace.", "Managed releases using feature flags (Firebase).", "Continuously improved development processes and code quality."])
        experience(story, s, "Eduardo Costa Software Solutions - Software Developer", "Feb. 2021 - Jul. 2021 | Brazil", ["Developed and evolved frontend applications with React and TypeScript.", "Built reusable components and improved code structure for scalability.", "Integrated REST APIs and collaborated with backend teams.", "Identified and fixed bugs, improving stability and user experience.", "Analyzed performance and implemented optimizations.", "Participated in technical decisions and the evolution of the codebase.", "Collaborated with cross-functional teams to deliver business-oriented features."])
        story.append(PageBreak())
        section(story, "Education", s)
        story.append(Paragraph("Bachelor's Degree in Software Engineering - Estacio (2025 - 2029)", s["body"]))
        section(story, "Technical Skills", s)
        for line in ["Frontend: React, Next.js, TypeScript, Tailwind CSS, Angular, Styled Components, SASS, HTML5, CSS3, Redux, Recoil, Context.js, Webpack, Zustand, Jotai", "Mobile: Flutter, Dart, React Native, TypeScript", "Backend: Node.js, MySQL, PostgreSQL, MongoDB, Redis, Docker, AWS, Serverless, REST APIs, RESTful APIs", "Observability: Datadog, Grafana, Dynatrace", "Testing: Unit, E2E, Integration, Load, Synthetic"]:
            story.append(Paragraph(line, s["skills"]))
        certificates = CERTIFICATES_EN
        certificate_title = "Certifications"
        credential_label = "Credential ID"
        issued_label = "issued"

    section(story, certificate_title, s)
    story.append(Paragraph(f"{len(certificates)} professional certificates", s["meta"]))
    story.append(Spacer(1, 5))
    for title, issuer, issued, credential in certificates:
        metadata = f"{issuer} | {issued_label} {issued}"
        if credential:
            metadata += f" | {credential_label}: {credential}"
        story.append(KeepTogether([
            Paragraph(title, s["role"]),
            Paragraph(metadata, s["cert"]),
        ]))
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


if __name__ == "__main__":
    build_resume("CurriculoSergioCosta.pdf", "pt")
    build_resume("SergioCostaResume.pdf", "en")
