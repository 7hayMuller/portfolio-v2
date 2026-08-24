const translations = {
  pt: {
    "hero.cta": "Case studies",
    "hero.image_alt": "Thayná na Shibuya Crossing",
    "about.text": [
      "Eu não vejo frontend e UX como dois trabalhos diferentes — são duas formas de resolver o mesmo problema.",
      "Nos últimos cinco anos, construí software enterprise com React e TypeScript. Com o tempo, minhas perguntas mudaram: menos sobre implementação, mais sobre pessoas. Por que essa feature existe? Que problema ela resolve? Por que essa interação é confusa? UX passou a fazer parte de como eu construo, não é uma trilha separada. Hoje trabalho entre engenharia, produto e design, construindo produtos SaaS com IA.",
      "Gosto de estéticas com ponto de vista forte — Bauhaus, Brutalismo, Blueprint, Futurismo. Toda decisão de design deveria parecer intencional; é isso que torna uma interface memorável, não só a aparência.",
      "Quando não estou trabalhando, você provavelmente vai me encontrar planejando minha próxima viagem, atrás de comida local autêntica, ou me apegando emocionalmente a personagens fictícios em mais um anime.",
    ],
    "project1.sub":
      "Criado a partir da necessidade de organizar minha própria viagem, o My Trip Buddy rapidamente evoluiu para muito além da ideia inicial. O aplicativo reúne destinos, hotéis, voos, itinerários, orçamento, documentos e até o planejamento dos looks para cada dia das férias, centralizando tudo em uma única experiência. O projeto foi concebido para reduzir a complexidade do planejamento e oferecer ao viajante uma forma prática e agradável de visualizar toda a viagem. Para complementar essa experiência, a interface adota uma identidade inspirada no neobrutalismo, combinando um visual marcante com uma navegação intuitiva e organizada.",
    "project2.sub":
      "O Party Studio é um estúdio criativo impulsionado por IA para quem quer ir além do convite tradicional. Em poucos minutos, você cria convites personalizados com fotos, vídeos e trilha sonora, transformando um simples convite em uma experiência que reflete o estilo da sua festa.",
    "project3.sub":
      "Como tornar o gerenciamento de medicamentos mais simples e acessível? O Remedia nasceu dessa pergunta. A partir de pesquisa, ideação, prototipação e testes de usabilidade, desenvolvi uma solução que reduz a complexidade da experiência e prioriza clareza, inclusão e facilidade de uso.",
    "project4.sub":
      "Este projeto explora a criação de um ecossistema financeiro integrado, conectando aplicativo móvel, desktop, smartwatch e caixas eletrônicos em uma experiência consistente. Ao longo do processo, desenvolvi wireframes, fluxos de navegação e visualizações de dados financeiros adaptadas a diferentes dispositivos, sempre priorizando clareza, acessibilidade e usabilidade. O resultado é uma experiência coesa, alinhada à identidade visual do Itaú e projetada para tornar o gerenciamento financeiro mais simples, intuitivo e eficiente.",
    "project5.sub":
      "Desenvolvido para tornar a busca por benefícios mais simples e conveniente, este aplicativo reúne cupons e ofertas exclusivas de estabelecimentos próximos ao usuário em uma única experiência. O projeto foi pensado para facilitar o acesso a descontos de forma rápida e intuitiva, combinando geolocalização, integração com APIs e uma navegação fluida para conectar pessoas às melhores oportunidades ao seu redor.",
    "project.link": "Ver site ↗",
    "contact.tag_main": "Quest principal",
    "contact.tag_side": "Side quest",
    "contact.copied": "Copiado!",
    "contact.available": "Disponível para novos projetos",
    "footer.copyright": "© 2026 Thayná Müller. Todos os direitos reservados.",
  },
  en: {
    "hero.cta": "Case Studies",
    "hero.image_alt": "Thayná at Shibuya Crossing",
    "about.text": [
      "I don't see frontend and UX as two different jobs — they're two ways of solving the same problem.",
      "For the past five years I've built enterprise software with React and TypeScript. Over time my questions shifted: less about implementation, more about people. Why does this feature exist? What problem does it solve? Why does this interaction feel confusing? UX became part of how I build, not a separate track. Today I work across engineering, product, and design, building SaaS and AI-powered products.",
      "I'm drawn to aesthetics with a strong point of view — Bauhaus, Brutalism, Blueprint, Futurism. Every design decision should feel intentional; that's what makes an interface memorable, not just how it looks.",
      "Outside of work, you'll probably find me planning my next trip, chasing authentic local food, or getting emotionally attached to fictional characters in yet another anime.",
    ],
    "project1.sub":
      "Born out of the need to organize my own trip, My Trip Buddy quickly grew far beyond its initial idea. The app brings together destinations, hotels, flights, itineraries, budget, documents, and even outfit planning for each day of the trip, centralizing everything into a single experience. It was designed to reduce the complexity of trip planning and give travelers a practical, enjoyable way to visualize the whole journey. To complement that experience, the interface adopts a neobrutalist-inspired identity, pairing a bold visual style with intuitive, organized navigation.",
    "project2.sub":
      "Party Studio is an AI-powered creative studio for anyone who wants to go beyond the traditional invitation. In just a few minutes, you create personalized invites with photos, videos, and a soundtrack, turning a simple invitation into an experience that reflects your party's style.",
    "project3.sub":
      "How can medication management be made simpler and more accessible? Remedia was born from that question. Through research, ideation, prototyping, and usability testing, I developed a solution that reduces the complexity of the experience while prioritizing clarity, inclusion, and ease of use.",
    "project4.sub":
      "This project explores building an integrated financial ecosystem, connecting mobile app, desktop, smartwatch, and ATMs into one consistent experience. Along the way, I developed wireframes, navigation flows, and financial data visualizations adapted to different devices, always prioritizing clarity, accessibility, and usability. The result is a cohesive experience aligned with Itaú's visual identity, designed to make financial management simpler, more intuitive, and more efficient.",
    "project5.sub":
      "Built to make finding deals simpler and more convenient, this app brings together coupons and exclusive offers from nearby businesses into a single experience. It was designed to make accessing discounts fast and intuitive, combining geolocation, API integrations, and smooth navigation to connect people with the best opportunities around them.",
    "project.link": "Visit site ↗",
    "contact.tag_main": "Main quest",
    "contact.tag_side": "Side quest",
    "contact.copied": "Copied!",
    "contact.available": "Available for new projects",
    "footer.copyright": "© 2026 Thayná Müller. All rights reserved.",
  },
};

function detectLang() {
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function applyLang(lang) {
  const dict = translations[lang];
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = dict[el.getAttribute("data-i18n")];
    if (value == null) return;

    if (Array.isArray(value)) {
      el.innerHTML = "";
      value.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        el.appendChild(p);
      });
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const value = dict[el.getAttribute("data-i18n-alt")];
    if (value != null) el.setAttribute("alt", value);
  });
}

applyLang(detectLang());
