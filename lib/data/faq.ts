export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const getLocalizedFaqs = (locale: string): FAQItem[] => {
  const isZh = locale === "zh";
  const isFr = locale === "fr";

  return [
    {
      id: "1",
      question: isZh
        ? "保修政策是什么？"
        : isFr
        ? "Quelle est la politique de garantie ?"
        : "What is the warranty policy?",
      answer: isZh
        ? "保修政策涵盖了由于制造工艺或材料缺陷引起的故障。具体保修期限和条款请参考您的车辆随附的《保修手册》，以确保您的权益得到保障。"
        : isFr
        ? "La politique de garantie couvre les pannes causées par des défauts de fabrication ou des vices de matériaux. Veuillez vous référer au Manuel de Garantie fourni avec votre véhicule pour les termes et durées spécifiques."
        : "The warranty policy covers failures caused by manufacturing defects or material quality. Please refer to the Warranty Manual provided with your vehicle for specific warranty durations and terms.",
    },
    {
      id: "2",
      question: isZh
        ? "可以去哪里维修？"
        : isFr
        ? "Où puis-je effectuer les réparations ?"
        : "Where can I get repairs?",
      answer: isZh
        ? "您可以前往任何一家Apsonic授权服务中心进行维修保养。我们的服务网络遍布各地，专业的技术团队将为您提供高标准的维护服务。"
        : isFr
        ? "Vous pouvez vous rendre dans n'importe quel centre de service agréé Apsonic pour l'entretien et les réparations. Notre réseau étendu et nos équipes techniques qualifiées garantissent un service de haute qualité."
        : "You can visit any authorized Apsonic service center for maintenance and repairs. Our widespread service network and professional technical teams ensure high-standard support.",
    },
    {
      id: "3",
      question: isZh
        ? "售后电话？"
        : isFr
        ? "Numéro de service après-vente ?"
        : "After-sales phone number?",
      answer: isZh
        ? "如有任何售后疑问，您可以直接联系购车的授权经销商，或查阅本网站“联系我们”页面中对应地区的办公电话。"
        : isFr
        ? "Pour toute question après-vente, vous pouvez contacter directement votre concessionnaire agréé ou consulter les numéros de téléphone locaux sur notre page 'Contactez-nous'."
        : "For any after-sales queries, you can directly contact your authorized dealer or refer to the office phone numbers listed for your region on our 'Contact Us' page.",
    },
    {
      id: "4",
      question: isZh
        ? "需要配件怎么办？"
        : isFr
        ? "Comment obtenir des pièces de rechange ?"
        : "How do I get spare parts?",
      answer: isZh
        ? "如需订购原厂配件，请咨询当地授权经销商或前往官方授权服务中心。使用原厂正品配件能确保您的车辆处于最佳运行状态。"
        : isFr
        ? "Pour commander des pièces d'origine, consultez votre concessionnaire local ou visitez un centre de service officiel. L'utilisation de pièces d'origine garantit le bon fonctionnement de votre véhicule."
        : "To order genuine spare parts, consult your local authorized dealer or visit an official service center. Using genuine parts ensures your vehicle remains in peak condition.",
    },
    {
      id: "5",
      question: isZh
        ? "保修是否包括配件的服务？"
        : isFr
        ? "La garantie couvre-t-elle les accessoires ?"
        : "Does the warranty cover accessories?",
      answer: isZh
        ? "标准保修涵盖摩托车和原厂安装的组件。售后配件和改装不在保修范围内。但是，从授权经销商购买的正品Apsonic配件可能有单独的保修保障。"
        : isFr
        ? "La garantie standard couvre la moto et les composants d'origine. Les accessoires de rechange et modifications sont exclus. Les pièces d'origine achetées chez un concessionnaire agréé peuvent bénéficier d'une garantie distincte."
        : "The standard warranty covers the motorcycle and original installed components. Aftermarket accessories and modifications are excluded. Genuine parts purchased from an authorized dealer may have a separate warranty.",
    },
    {
      id: "6",
      question: isZh
        ? "我的摩托车多久可以修好？"
        : isFr
        ? "Combien de temps prendra la réparation ?"
        : "How long will my motorcycle repair take?",
      answer: isZh
        ? "维修时间取决于问题的性质和配件可用性。标准服务通常需要1-2个工作日。对于保修维修，我们力争在3-5个工作日内完成服务。复杂的维修可能需要更长时间，我们会及时告知您进度。"
        : isFr
        ? "Le délai dépend du problème et de la disponibilité des pièces. Les entretiens standards prennent 1 à 2 jours. Les réparations sous garantie prennent 3 à 5 jours. Nous vous tiendrons informé en cas de réparation complexe."
        : "Repair time depends on the issue and parts availability. Standard servicing takes 1-2 business days. Warranty repairs aim for 3-5 business days. Complex jobs may take longer, and we will update you regularly.",
    },
    {
      id: "7",
      question: isZh
        ? "如果我怀疑是假冒配件该怎么办？"
        : isFr
        ? "Que faire si je soupçonne des contrefaçons ?"
        : "What if I suspect counterfeit parts?",
      answer: isZh
        ? "如果您怀疑是假冒配件，请立即停止使用并联系我们的客户服务。请报告销售商和购买地点。我们将进行调查并提供指导。使用假冒配件可能会使您的保修失效并带来安全风险。"
        : isFr
        ? "Si vous soupçonnez des pièces contrefaites, cessez leur utilisation et contactez le service client. Signalez le vendeur et le lieu d'achat. L'usage de contrefaçons annule la garantie et présente des risques de sécurité."
        : "If you suspect counterfeit parts, stop using them immediately and contact customer service. Report the seller and purchase location. Using counterfeits voids your warranty and poses safety risks.",
    },
  ];
};
