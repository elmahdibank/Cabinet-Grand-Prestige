import React, { useState, useEffect, Fragment } from "react";
import emailjs from "@emailjs/browser";
import {
  Smile, Sparkles, Anchor, Scissors, Shield, Settings, Baby, AlertTriangle,
  Phone, Mail, MapPin, Clock, MessageCircle,
  ChevronDown, ChevronUp, Menu, X, Star,
  ArrowLeft, ArrowRight, Award, Heart, Check, Zap, Users, Download
} from "lucide-react";

// ════════════════════════════════════════════════════════════════════
// ⚙️  CONFIG — TOUTES LES DONNÉES SPÉCIFIQUES AU CABINET / PROSPECT
// ════════════════════════════════════════════════════════════════════
// Pour adapter ce template à un nouveau client : ne modifier QUE ce bloc.
// Aucune autre partie du fichier ne devrait avoir besoin d'être touchée.
// ════════════════════════════════════════════════════════════════════
const CONFIG = {

  // ─── Identité ────────────────────────────────────────
  cabinetName:      "Grand Prestige",                              // nom court (Nav, Footer, cartes...)
  cabinetNameFull:  "Centre Dentaire Grand Prestige",               // nom complet (titres de page, copyright...)
  doctorName:       "Dr. Kawtar Fattane",                           // nom complet du docteur
  doctorShortName:  "Dr. Fattane",                                  // forme courte (citations, mentions rapides)
  doctorTitle:      "Orthodontiste & Implantologiste",              // spécialité affichée sous le nom

  // ─── Équipe (assistante / secrétaire) ─────────────────
  // "name" à adapter plus tard avec les vrais noms fournis par le client
  staff: [
    { initials:'NP', name:'Nom & Prénom', role:'Assistante Dentaire Qualifiée', desc:'Assistante spécialisée en orthodontie et implantologie. Assure le confort et la sécurité des patients.' },
    { initials:'NP', name:'Nom & Prénom', role:'Secrétaire Médicale',            desc:'Gestion des rendez-vous, accueil patients, suivi administratif. Votre interlocutrice privilégiée.' },
  ],

  // ─── Contact ──────────────────────────────────────────
  phoneDisplay:   "06 XX XX XX XX",     // format affiché au visiteur
  phoneHref:      "0600000000",         // format utilisé dans les liens tel: (chiffres uniquement)
  whatsappNumber: "212600000000",       // format international sans "+" pour les liens wa.me
  email:          "contact@grandprestige.ma",

  // ─── Horaires (source unique — pilote l'affichage ET les créneaux RDV réservables) ───
  hours: {
    weekdayOpen:  "09:00",
    weekdayClose: "18:00",
    lunchStart:   "12:00",   // pause déjeuner en semaine (laisser identique à lunchEnd pour désactiver la pause)
    lunchEnd:     "14:00",
    saturdayOpen: "09:00",
    saturdayClose:"15:00",
    sundayClosed: true,
  },

  // ─── Réseaux sociaux (liens génériques pour l'instant — à remplacer par les vrais profils) ───
  social: {
    facebook:  "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin:  "https://linkedin.com",
  },

  // ─── Localisation ─────────────────────────────────────
  city:    "Témara",
  country: "Maroc",
  addressFull:  "Angle Av. Hassan II / Bd. Gaza, Résidence Al Awaile, Imm. A, 4ème étage, Bureau 23, Témara Centre, Maroc",
  addressLines: ["Angle Av. Hassan II / Bd. Gaza", "Résidence Al Awaile, Imm. A, 4ème étage, Bureau 23", "Témara Centre, Maroc"], // affichage 3 lignes (page Contact)
  addressShort: "Angle Av. Hassan II — Résidence Al Awaile, Témara",
  // Lien d'intégration Google Maps (iframe) — voir Google Maps > Partager > Intégrer une carte
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.5327!2d-6.9273945!3d33.9183331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ead241a217c5a75%3A0xb9808936c37da6da!2sCentre%20Dentaire%20Grand%20Prestige%20-%20Orthodontie%20et%20Invisalign%20%C3%A0%20Temara!5e0!3m2!1sfr!2sma!4v1750000000000!5m2!1sfr!2sma",
  mapsLink: "https://maps.app.goo.gl/nmmtWJmPeWNcD8Uh7", // lien "Ouvrir sur Maps" (bouton, partage...)

  // ─── Images — page "À propos" (URLs Cloudinary une fois disponibles ; vide = placeholder "Photo à venir") ───
  aboutImages: [
    { label:'Salle de traitement principale', url:'https://res.cloudinary.com/dwc0dqqs5/image/upload/v1785849009/salle_de_soin_2_udmnwr.jpg' },
    { label:'Scanner intra-oral 3Shape',       url:'https://res.cloudinary.com/dwc0dqqs5/image/upload/v1785849009/scanner_3shape_uaud2g.jpg' },
    { label:'Salle de stérilisation',          url:'' },
    { label:'Espace orthodontie',              url:'' },
    { label:'Radiologie CBCT 3D',              url:'https://res.cloudinary.com/dwc0dqqs5/image/upload/v1785849009/radio_360_zhecdw.jpg' },
    { label:"Salle d'attente",                 url:'https://res.cloudinary.com/dwc0dqqs5/image/upload/v1785849009/salle_d_attente_f9g7nt.jpg' },
  ],

  // ─── Logo & favicon (URLs — vide = fallback texte / favicon par défaut) ───
  logoUrl:    "",
  faviconUrl: "",
  heroBackgroundUrl: "https://res.cloudinary.com/dwc0dqqs5/image/upload/v1785849009/acceuil_rqkufq.jpg", // photo de fond du Hero (Accueil)

  // ─── Identifiants de connexion CRM (Espace Admin) ─────
  // À changer pour chaque nouveau client lors de la mise en production (email pro + mot de passe dédié).
  crmAuth: {
    email: "admin@grandprestige.ma",
    password: "GrandPrestige2025",
  },

  // ─── EmailJS — notification automatique du docteur à chaque RDV ───
  // Compte de test pour l'instant (à remplacer par le vrai compte EmailJS connecté au Gmail du client en Phase B)
  emailjs: {
    serviceId:  "service_ocfw0ds",   // Gmail - MMC (compte de test)
    templateId: "template_zo73en6",  // Template "Contact Us" (Nouveau RDV)
    publicKey:  "45VxXwL_qPxuDSy1k",
    notifyEmail: "elmahdivers@gmail.com", // adresse qui reçoit la notification RDV — à remplacer par l'email réel du docteur pour un vrai client
  },

  // ─── Palette de couleurs du site ──────────────────────
  colors: {
    navy:'#0B1829', navyM:'#16293D', navyL:'#1E3A52',
    gold:'#BF9A55', goldL:'#D4B878', goldP:'#F5EDD8',
    cream:'#FDFBF8', white:'#FFFFFF',
    gray:'#64748B', grayL:'#F1F5F9', border:'#E2E8F0',
    ok:'#10B981', err:'#EF4444', info:'#3B82F6',
  },

  // ─── Avis Google (copier-coller manuel — 6 avis 5/5 depuis la fiche Google Maps du cabinet) ───
  // Accueil affiche les 3 premiers · "À propos" affiche les 6, par blocs de 3
  reviews: [
    { name:'Amina Berrada', initials:'AB', rating:5, date:'il y a 2 semaines',  svc:'Orthodontie Invisalign',
      text:'Docteur Fattane est vraiment exceptionnelle. Mon traitement Invisalign avance parfaitement, elle explique chaque étape avec beaucoup de patience. Cabinet moderne et propre, équipe accueillante. Je recommande vivement à toute ma famille.' },
    { name:'Youssef Khalil', initials:'YK', rating:5, date:'il y a 1 mois',    svc:'Implantologie',
      text:'Impressionné par le professionnalisme. Mes implants ont été posés avec une technologie 3D que je ne connaissais pas. Aucune douleur pendant ni après. Le résultat est parfait, on ne voit pas la différence avec mes vraies dents. Merci Dr Fattane !' },
    { name:'Rajae Moussaoui', initials:'RM', rating:5, date:'il y a 3 semaines', svc:'Esthétique Dentaire',
      text:'J\'avais un complexe par rapport à mes dents depuis des années. Dr Fattane a tout changé. Les facettes sont magnifiques et 100% naturelles. Elle a pris le temps de me montrer le résultat en simulation avant de commencer. Je retrouve confiance en moi !' },
    { name:'Hassan El Idrissi', initials:'HE', rating:5, date:'il y a 2 mois',  svc:'Chirurgie Dentaire',
      text:'Extraction de dent de sagesse incluse sans aucune douleur. Dr Fattane a su gérer mon anxiété avec beaucoup de calme et de professionnalisme. Cabinet très bien situé à Témara. Je n\'hésiterai plus à venir chez le dentiste.' },
    { name:'Nadia Ouali', initials:'NO', rating:5, date:'il y a 1 semaine',    svc:'Soins Conservateurs',
      text:'J\'ai une vraie phobie des dentistes et j\'avais évité les soins pendant des années. Grâce à Dr Fattane et à son équipe, j\'ai tout traité en 3 séances dans un confort total. Je ne sens plus aucune douleur. Vraiment la meilleure dentiste de Témara.' },
    { name:'Karim Tahiri', initials:'KT', rating:5, date:'il y a 3 mois',      svc:'Blanchiment Dentaire',
      text:'Super résultat pour mon blanchiment professionnel ! Plusieurs tons en une seule séance. Le cabinet est équipé du meilleur matériel. Dr Fattane est précise, rapide et explique tout ce qu\'elle fait. L\'équipe est sympathique et professionnelle. Je reviendrai !' },
  ],
};
// ════════════════════════════════════════════════════════════════════
// FIN DU BLOC CONFIG — le reste du fichier ne devrait plus nécessiter
// de modification lors de l'adaptation à un nouveau client.
// ════════════════════════════════════════════════════════════════════

// ─── PALETTE ───────────────────────────────────────────
// Alias court "C" conservé pour éviter de renommer les ~300 usages C.xxx dans tout le fichier ;
// la vraie source de vérité reste CONFIG.colors ci-dessus.
const C = CONFIG.colors;

// ─── AVIS GOOGLE (alias) ──────────────────────────────
const ALL_REVIEWS = CONFIG.reviews;

// ─── TYPO HELPERS ─────────────────────────────────────
const serif = (x={}) => ({ fontFamily:"'Cormorant Garamond','Georgia',serif", ...x });
const jost  = (x={}) => ({ fontFamily:"'Jost','Helvetica Neue',sans-serif", ...x });

// ─── GLOBAL RESPONSIVE CSS ────────────────────────────
function GlobalStyles() {
  return <style>{`
    *{box-sizing:border-box;} a{text-decoration:none;} button{font-family:inherit;}
    .g2{display:grid;grid-template-columns:repeat(2,1fr);gap:22px;}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
    .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
    .gstats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
    .ghero{display:grid;grid-template-columns:1fr 400px;gap:64px;align-items:center;}
    .gfooter{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:44px;}
    .gabout{display:grid;grid-template-columns:280px 1fr;gap:60px;align-items:start;}
    .gclinic{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
    .gform2{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
    .nav-d{display:flex;gap:4px;align-items:center;}
    .nav-m-btn{display:none!important;}
    .nav-m-menu{display:none!important;}
    .nav-m-menu.open{display:flex!important;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:white;padding:12px 16px;border-bottom:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(0,0,0,.1);z-index:98;gap:2px;}
    .hero-visual{display:flex;}
    .svc-expand{overflow:hidden;transition:max-height .35s ease,opacity .3s ease;}
    @media(max-width:960px){
      .ghero{grid-template-columns:1fr!important;}
      .hero-visual{display:none!important;}
      .gfooter{grid-template-columns:1fr 1fr!important;gap:28px!important;}
      .gclinic{grid-template-columns:repeat(2,1fr)!important;}
    }
    @media(max-width:768px){
      .nav-d{display:none!important;}
      .nav-m-btn{display:flex!important;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;padding:8px;}
      .g2{grid-template-columns:1fr!important;}
      .g3{grid-template-columns:1fr!important;}
      .g4{grid-template-columns:repeat(2,1fr)!important;}
      .gstats{grid-template-columns:repeat(2,1fr)!important;}
      .gfooter{grid-template-columns:1fr!important;}
      .gabout{grid-template-columns:1fr!important;}
      .gform2{grid-template-columns:1fr!important;}
      .section-pad{padding:48px 16px!important;}
      .page-hero-pad{padding:44px 16px 38px!important;}
      .hero-h1{font-size:34px!important;}
      .section-h2{font-size:26px!important;}
      .page-h1{font-size:28px!important;}
      .hero-cta{flex-direction:column!important;}
      .cta-btns{flex-direction:column!important;align-items:center!important;}
      .cta-btns>*{width:100%!important;max-width:300px!important;text-align:center!important;}
      .hero-badges{display:none!important;}
    }
    @media(max-width:480px){
      .g4{grid-template-columns:1fr!important;}
      .gclinic{grid-template-columns:1fr!important;}
    }
  `}</style>;
}

// ─── 8 SERVICES ───────────────────────────────────────
const SERVICES = [
  { id:'ortho',  Icon:Smile,       name:'Orthodontie & Invisalign',          premium:true,
    short:'Correction des malpositions dentaires avec les systèmes les plus modernes.',
    long:'Nous proposons les appareils Damon (sans ligatures), les gouttières invisibles Invisalign et les techniques linguales. Chaque traitement débute par un scanner intra-oral 3Shape et une simulation numérique du résultat final. Traitement adulte et enfant, durée moyenne 12–24 mois selon les cas.' },
  { id:'esth',   Icon:Sparkles,    name:'Esthétique Dentaire',               premium:true,
    short:'Transformez votre sourire avec les techniques esthétiques les plus avancées.',
    long:'Facettes composites et céramiques, Hollywood Smile, Digital Smile Design (DSD), blanchiment professionnel LED et reconstruction complète du sourire. Chaque projet esthétique est simulé numériquement avant toute intervention pour que vous visualisiez votre résultat à l\'avance.' },
  { id:'implant',Icon:Anchor,      name:'Implantologie Numérique',           premium:false,
    short:'Remplacement des dents manquantes par des implants de dernière génération.',
    long:'Implants planifiés par logiciel 3D (chirurgie guidée), pose sans incision dans les cas indiqués, couronne zircone sur mesure. La technologie CBCT nous permet une précision au dixième de millimètre. Résultats durables, esthétique naturelle, fonctionnement identique à une dent naturelle.' },
  { id:'chir',   Icon:Scissors,    name:'Chirurgie Dentaire',                premium:false,
    short:'Extractions complexes, greffes et chirurgie des tissus sous anesthésie locale confortable.',
    long:'Extractions simples et complexes (dents de sagesse incluses), greffes osseuses et membranes barrières, chirurgie parodontale, frénotomies. Toutes les interventions sont réalisées sous anesthésie locale efficace, avec sédation consciente disponible pour les patients anxieux.' },
  { id:'soins',  Icon:Shield,      name:'Soins Conservateurs & Parodontologie', premium:false,
    short:'Traitement des caries, des gencives et prévention bucco-dentaire pour toute la famille.',
    long:'Obturations en composite esthétique, dévitalisations (endodontie), détartrage et surfaçage radiculaire, traitement des maladies parodontales. Un bilan de santé complet est réalisé lors de la première visite pour établir un plan de traitement personnalisé et préventif.' },
  { id:'proth',  Icon:Settings,    name:'Prothèse Dentaire',                 premium:false,
    short:'Couronnes, bridges et prothèses sur mesure pour retrouver une dentition complète.',
    long:'Couronnes en zircone pressée, bridges céramique-métal ou tout-céramique, prothèses amovibles partielles et complètes, prothèses sur implants (bridge implanto-porté, all-on-4). Toutes les prothèses sont réalisées avec les matériaux les plus esthétiques et les plus durables du marché.' },
  { id:'pedo',   Icon:Baby,        name:'Pédodontie',                        premium:false,
    short:'Soins dentaires adaptés aux enfants dans un environnement rassurant et ludique.',
    long:'Consultations précoces dès 3 ans, scellements de sillons, fluoration, soins sous MEOPA (gaz hilarant), traitement des caries de l\'enfant, suivi de l\'éruption dentaire et orientation orthodontique préventive. Notre approche douce et pédagogique transforme la visite chez le dentiste en expérience positive.' },
  { id:'urgence',Icon:AlertTriangle, name:'Urgences Dentaires',               premium:false,
    short:'Prise en charge prioritaire des douleurs et traumatismes dentaires 7j/7.',
    long:'Douleurs aiguës, abcès, fractures dentaires, traumatismes, couronne ou bridge décollé — nos patients bénéficient d\'une prise en charge prioritaire. Contactez-nous par téléphone ou WhatsApp pour une intervention rapide. Des créneaux d\'urgence sont réservés chaque jour de la semaine.' },
];

// Status CRM
const STATUS = {
  'Nouveau':  {bg:'#EFF6FF',color:'#1D4ED8',dot:'#3B82F6'},
  'Contacté': {bg:'#FFFBEB',color:'#92400E',dot:'#F59E0B'},
  'Planifié': {bg:'#F5F3FF',color:'#5B21B6',dot:'#7C3AED'},
  'Terminé':  {bg:'#ECFDF5',color:'#065F46',dot:'#10B981'},
  'Clôturé':  {bg:C.grayL, color:C.gray,   dot:'#94A3B8'},
};
const STATUSES = Object.keys(STATUS);

// Sample CRM data
const SAMPLE_DATA = [
  {id:'s1',customer_name:'Aicha Benali',phone:'0612 456 789',service_type:'Orthodontie & Invisalign',description:'Souhait de corriger l\'alignement des dents supérieures.',preferred_date:'2025-06-20',preferred_time:'10:00',status:'Planifié',notes:'RDV confirmé pour consultation initiale.',created_at:'2025-06-10T09:23:00.000Z'},
  {id:'s2',customer_name:'Mohamed El Fassi',phone:'0661 789 012',service_type:'Implantologie Numérique',description:'Dent manquante suite à extraction, souhaite un implant.',preferred_date:'2025-06-22',preferred_time:'14:00',status:'Contacté',notes:'Informé des tarifs. Réfléchit avant confirmation.',created_at:'2025-06-11T14:15:00.000Z'},
  {id:'s3',customer_name:'Samira Ouali',phone:'0677 234 567',service_type:'Esthétique Dentaire',description:'Intéressée par Hollywood Smile avec facettes céramiques.',preferred_date:'2025-06-25',preferred_time:'11:00',status:'Nouveau',notes:'',created_at:'2025-06-12T08:45:00.000Z'},
  {id:'s4',customer_name:'Karim Tazi',phone:'0654 321 098',service_type:'Esthétique Dentaire',description:'Blanchiment dentaire professionnel.',preferred_date:'2025-06-17',preferred_time:'16:00',status:'Terminé',notes:'Traitement effectué. Patient très satisfait.',created_at:'2025-06-08T11:30:00.000Z'},
  {id:'s5',customer_name:'Fatima Idrissi',phone:'0698 765 432',service_type:'Pédodontie',description:'Bilan dentaire pour fils de 8 ans.',preferred_date:'2025-06-28',preferred_time:'09:00',status:'Nouveau',notes:'',created_at:'2025-06-12T16:20:00.000Z'},
];

// ─── DATE HELPERS ─────────────────────────────────────
// Horaires du cabinet pilotés entièrement par CONFIG.hours (voir bloc CONFIG en tête de fichier)
const toMin  = (hhmm) => { const [h,m]=hhmm.split(':').map(Number); return h*60+m; };
const hFull  = (hhmm) => hhmm.replace(':','h');                                    // "09:00" → "09h00"
const hShort = (hhmm) => { const [h,m]=hhmm.split(':'); const n=parseInt(h,10); return m==='00' ? `${n}h` : `${n}h${m}`; }; // "09:00" → "9h" / "14:30" → "14h30"

const getMinDate = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};
const getTodayStr = () => new Date().toISOString().split('T')[0];
const buildRange = (startMin, endMin, step=30) => {
  const arr=[];
  for (let t=startMin; t<=endMin; t+=step) {
    const hh=String(Math.floor(t/60)).padStart(2,'0');
    const mm=String(t%60).padStart(2,'0');
    arr.push(`${hh}:${mm}`);
  }
  return arr;
};
// Prochain créneau disponible (30min), strictement postérieur à l'heure actuelle
const getNextAvailableMinutes = () => {
  const now = new Date();
  const minutes = now.getHours()*60+now.getMinutes();
  let rounded = Math.ceil(minutes/30)*30;
  if (rounded <= minutes) rounded += 30;
  return rounded;
};
const getTimeSlots = (dateStr) => {
  if (!dateStr) return [];
  const day = new Date(dateStr+'T00:00:00').getDay();
  const H = CONFIG.hours;
  if (day===0 && H.sundayClosed) return []; // Dimanche fermé
  let slots = day===6
    ? buildRange(toMin(H.saturdayOpen), toMin(H.saturdayClose)-30)                                   // Samedi : dernier créneau 30min avant la fermeture
    : [...buildRange(toMin(H.weekdayOpen), toMin(H.lunchStart)), ...buildRange(toMin(H.lunchEnd), toMin(H.weekdayClose)-30)]; // Lun-Ven avec pause déjeuner
  if (dateStr === getTodayStr()) {
    const minMinutes = getNextAvailableMinutes();
    slots = slots.filter(t=>{
      const [hh,mm] = t.split(':').map(Number);
      return (hh*60+mm) >= minMinutes;
    });
  }
  return slots;
};
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}); } catch{return '—';} };
const fmtFull = (iso) => { try { return new Date(iso).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); } catch{return '—';} };

// ─── EMAILJS — Notification du docteur à chaque nouvelle demande de RDV ───
// Ne fait RIEN tant que CONFIG.emailjs.serviceId/templateId/publicKey ne sont pas remplis (mode "compte de test" par défaut).
// Les noms de variables ci-dessous (patient_name, patient_phone, ...) doivent correspondre exactement
// aux {{variables}} utilisées dans le template EmailJS créé sur le dashboard.
const sendRdvNotification = (req) => {
  const { serviceId, templateId, publicKey } = CONFIG.emailjs;
  if (!serviceId || !templateId || !publicKey) {
    console.warn('[EmailJS] Notification non envoyée — serviceId/templateId/publicKey non configurés dans CONFIG.emailjs.');
    return;
  }
  // Ordre aligné sur les colonnes du tableau CRM : Date de création → Patient → Téléphone → Soin → Date & Heure RDV → Statut
  // (rappel : cet ordre n'a aucun impact sur l'email final — seul l'emplacement de {{variable}} dans le template EmailJS compte)
  const templateParams = {
    to_email:        CONFIG.emailjs.notifyEmail, // destinataire — correspond à {{to_email}} dans le champ "To Email" du template
    created_at:      fmtFull(req.created_at),
    patient_name:    req.customer_name,
    patient_phone:   req.phone,
    service_type:    req.service_type,
    rdv_date:        req.preferred_date ? fmtDate(req.preferred_date) : '—',
    rdv_time:        req.preferred_time || '—',
    status:          req.status,
    patient_message: req.description || '(aucun message)',
    cabinet_name:    CONFIG.cabinetNameFull,
    doctor_name:     CONFIG.doctorName,
  };
  emailjs.send(serviceId, templateId, templateParams)
    .then(()=> console.log('[EmailJS] Notification envoyée avec succès.'))
    .catch(err => console.error('[EmailJS] Échec de l\'envoi (le RDV reste enregistré normalement) :', err));
};


// Bloc carte interactive réutilisable (Home, Services, Contact) — le bouton "Ouvrir sur Maps" natif
// de Google (coin supérieur gauche de l'iframe) suffit ; pas de bouton flottant custom en superposition.
function MapSection() {
  return (
    <section style={{background:C.white,borderTop:`1px solid ${C.border}`}}>
      <div style={{position:'relative',overflow:'hidden'}}>
        <iframe
          src={CONFIG.mapEmbedUrl}
          width="100%"
          height="460"
          style={{border:0,display:'block'}}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${CONFIG.cabinetNameFull} — ${CONFIG.city}`}
        />
      </div>
    </section>
  );
}

// ─── WHATSAPP ICON ─────────────────────────────────────
const WAIcon = ({size=20,color='currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

// ─── RÉSEAUX SOCIAUX (SVG inline — évite la dépendance aux icônes lucide-react qui varient selon la version installée) ───
const FacebookIcon = ({size=20,color='currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = ({size=20,color='currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const LinkedinIcon = ({size=20,color='currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// ─── NAV ─────────────────────────────────────────────
function Nav({page, nav}) {
  const [mOpen, setMOpen] = useState(false);
  const links = [{id:'home',l:'Accueil'},{id:'services',l:'Soins & Services'},{id:'about',l:'À propos'},{id:'contact',l:'Contact'}];
  const go = p => { nav(p); setMOpen(false); };
  return (
    <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:100,...jost()}}>
      <div className="nav-max" style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',height:68,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <button onClick={()=>go('home')} style={{background:'none',border:'none',cursor:'pointer',padding:0,textAlign:'left'}}>
          {CONFIG.logoUrl ? (
            <img src={CONFIG.logoUrl} alt={CONFIG.cabinetName} style={{height:38,display:'block'}}/>
          ) : (
            <>
              <div style={{...serif(),fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:C.gold,fontWeight:500}}>Centre Dentaire</div>
              <div style={{...serif(),fontSize:19,fontWeight:600,color:C.navy,lineHeight:1.1}}>{CONFIG.cabinetName}</div>
            </>
          )}
        </button>
        {/* Desktop nav */}
        <div className="nav-d">
          {links.map(l=>(
            <button key={l.id} onClick={()=>go(l.id)} style={{background:'none',border:'none',cursor:'pointer',padding:'8px 13px',fontSize:13.5,fontWeight:page===l.id?600:400,color:page===l.id?C.navy:C.gray,borderBottom:page===l.id?`2.5px solid ${C.gold}`:'2.5px solid transparent',...jost()}}>
              {l.l}
            </button>
          ))}
          <button onClick={()=>go('rdv')} style={{marginLeft:12,background:C.gold,color:C.navy,border:'none',padding:'10px 20px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:700,letterSpacing:'0.05em',...jost()}}>
            Prendre RDV
          </button>
        </div>
        {/* Mobile hamburger */}
        <button className="nav-m-btn" onClick={()=>setMOpen(!mOpen)} style={{color:C.navy}}>
          {mOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {/* Mobile menu */}
      <div className={`nav-m-menu${mOpen?' open':''}`} style={{...jost()}}>
        {links.map(l=>(
          <button key={l.id} onClick={()=>go(l.id)} style={{background:'none',border:'none',cursor:'pointer',padding:'11px 8px',fontSize:15,fontWeight:page===l.id?600:400,color:page===l.id?C.navy:C.gray,textAlign:'left',borderBottom:`1px solid ${C.border}`}}>
            {l.l}
          </button>
        ))}
        <button onClick={()=>go('rdv')} style={{marginTop:8,background:C.gold,color:C.navy,border:'none',padding:'12px 20px',borderRadius:4,cursor:'pointer',fontSize:14,fontWeight:700,width:'100%',...jost()}}>
          Prendre RDV
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────
function Hero({nav}) {
  return (
    <section style={{
        background: CONFIG.heroBackgroundUrl
          ? `linear-gradient(rgba(11,24,41,0.87), rgba(11,24,41,0.92)), url(${CONFIG.heroBackgroundUrl})`
          : C.navy,
        backgroundSize:'cover', backgroundPosition:'center',
        color:C.white,padding:'88px 24px 72px',overflow:'hidden',position:'relative'}}>
      {[{s:500,t:-80,r:-80,o:.1},{s:300,t:50,r:80,o:.07}].map((c,i)=>(
        <div key={i} style={{position:'absolute',top:c.t,right:c.r,width:c.s,height:c.s,borderRadius:'50%',border:`1px solid rgba(191,154,85,${c.o})`,pointerEvents:'none'}}/>
      ))}
      <div className="ghero" style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="hero-text">
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
            <div style={{width:32,height:1,background:C.gold}}/>
            <span style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.goldL}}>{CONFIG.doctorName} — {CONFIG.doctorTitle}</span>
          </div>
          <h1 className="hero-h1" style={{...serif(),fontSize:58,fontWeight:400,lineHeight:1.08,margin:'0 0 20px',color:C.white}}>
            L'Art du<br/><em style={{color:C.goldL,fontStyle:'italic'}}>Sourire Parfait</em>
          </h1>
          <p style={{...jost(),fontSize:16,lineHeight:1.8,color:'rgba(255,255,255,0.68)',margin:'0 0 32px',maxWidth:480,fontWeight:300}}>
            Cabinet dentaire d'excellence à {CONFIG.city}. Orthodontie Invisalign, esthétique premium et implantologie numérique avec les technologies les plus avancées.
          </p>
          <div className="hero-cta" style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            <button onClick={()=>nav('rdv')} style={{background:C.gold,color:C.navy,border:'none',padding:'14px 30px',borderRadius:4,cursor:'pointer',fontSize:13,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',...jost()}}>
              Prendre Rendez-vous
            </button>
            <button onClick={()=>nav('services')} style={{background:'transparent',color:C.white,border:'1px solid rgba(255,255,255,0.28)',padding:'14px 26px',borderRadius:4,cursor:'pointer',fontSize:13,...jost()}}>
              Nos soins →
            </button>
          </div>
          <div className="hero-badges" style={{display:'flex',gap:8,marginTop:36,flexWrap:'wrap'}}>
            {['Invisalign Provider','Damon Certifiée','Digital Smile Design','Scanner 3Shape'].map(b=>(
              <span key={b} style={{background:'rgba(191,154,85,0.14)',border:'1px solid rgba(191,154,85,0.28)',color:C.goldL,padding:'5px 11px',borderRadius:20,fontSize:11.5,fontWeight:500}}>{b}</span>
            ))}
          </div>
        </div>
        {/* Visual ring */}
        <div className="hero-visual" style={{justifyContent:'center',alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <div style={{width:340,height:340,borderRadius:'50%',border:`1.5px solid rgba(191,154,85,0.35)`,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:270,height:270,borderRadius:'50%',background:'rgba(191,154,85,0.07)',border:'1px solid rgba(191,154,85,0.18)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
                <Smile size={48} color={C.gold} strokeWidth={1.2} style={{opacity:0.65}}/>
                <div style={{...serif(),fontSize:15,color:C.white,fontWeight:300,letterSpacing:'0.1em',textTransform:'uppercase'}}>{CONFIG.cabinetName}</div>
                <div style={{width:32,height:1,background:C.gold,opacity:0.5}}/>
                <div style={{...jost(),fontSize:11,color:C.goldL,letterSpacing:'0.18em',textTransform:'uppercase'}}>{CONFIG.city} · {CONFIG.country}</div>
              </div>
            </div>
            {[{l:'500+',s:'Patients',style:{top:24,right:-32}},{l:'100%',s:'Numérique',style:{bottom:60,left:-40}},{l:'10+',s:'Certifications',style:{bottom:24,right:-16}}].map((st,i)=>(
              <div key={i} style={{position:'absolute',...st.style,background:C.navyM,border:'1px solid rgba(191,154,85,0.28)',borderRadius:8,padding:'9px 14px',textAlign:'center',minWidth:86}}>
                <div style={{...serif(),fontSize:20,fontWeight:600,color:C.goldL,lineHeight:1}}>{st.l}</div>
                <div style={{...jost(),fontSize:11,color:'rgba(255,255,255,0.55)',marginTop:2}}>{st.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────
function StatsBar() {
  return (
    <div style={{background:C.goldP,borderBottom:`1px solid ${C.border}`}}>
      <div className="gstats" style={{maxWidth:1200,margin:'0 auto',padding:'20px 24px'}}>
        {[{n:'500+',l:'Patients satisfaits'},{n:'10+',l:'Certifications'},{n:'100%',l:'Équipement numérique'},{n:'7j/7',l:'Urgences'}].map((s,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div style={{...serif(),fontSize:28,fontWeight:600,color:C.navy}}>{s.n}</div>
            <div style={{...jost(),fontSize:13,color:C.gray,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA BANNER ──────────────────────────────────────
function CTABanner({nav}) {
  return (
    <section style={{background:C.goldP,borderTop:`1px solid ${C.border}`,padding:'60px 24px'}}>
      <div style={{maxWidth:640,margin:'0 auto',textAlign:'center'}}>
        <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.gold,marginBottom:12}}>Consultation</div>
        <h2 className="section-h2" style={{...serif(),fontSize:36,fontWeight:400,color:C.navy,margin:'0 0 12px'}}>Prenez Rendez-vous Aujourd'hui</h2>
        <p style={{...jost(),fontSize:15.5,color:C.gray,lineHeight:1.75,margin:'0 0 28px'}}>
          Consultation personnalisée, devis gratuit et transparent. Notre équipe vous guide vers le sourire que vous méritez.
        </p>
        <div className="cta-btns" style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>nav('rdv')} style={{background:C.navy,color:C.white,border:'none',padding:'14px 32px',borderRadius:4,cursor:'pointer',fontSize:13.5,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',...jost()}}>
            Réserver ma Consultation
          </button>
          <a href={`tel:${CONFIG.phoneHref}`} style={{display:'inline-flex',alignItems:'center',gap:8,background:C.white,color:C.navy,border:`1px solid ${C.border}`,padding:'14px 24px',borderRadius:4,fontSize:13.5,...jost()}}>
            <Phone size={15}/> Appeler le cabinet
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION HEADER ──────────────────────────────────
function SH({tag,title,sub}) {
  return (
    <div style={{textAlign:'center',marginBottom:48}}>
      {tag && <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.gold,marginBottom:10}}>{tag}</div>}
      <h2 className="section-h2" style={{...serif(),fontSize:38,fontWeight:400,color:C.navy,margin:'0 0 12px'}}>{title}</h2>
      {sub && <p style={{...jost(),fontSize:15.5,color:C.gray,maxWidth:520,margin:'0 auto',lineHeight:1.75}}>{sub}</p>}
    </div>
  );
}

// ─── HOME SERVICES PREVIEW ────────────────────────────
function HomeServices({nav}) {
  return (
    <section className="section-pad" style={{background:C.white,padding:'80px 24px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <SH tag="Nos Spécialités" title="Des Soins d'Excellence" sub="Technologies de pointe et expertise reconnue au service de votre santé bucco-dentaire."/>
        <div className="g2" style={{marginBottom:36}}>
          {SERVICES.slice(0,4).map((s,i)=>{
            const IC = s.Icon;
            return (
              <div key={i} style={{display:'flex',gap:20,padding:'24px 22px',border:`1px solid ${C.border}`,borderRadius:8,background:s.premium?C.goldP:C.white,position:'relative',overflow:'hidden',cursor:'pointer'}} onClick={()=>nav('services')}>
                {s.premium && <div style={{position:'absolute',top:0,right:0,background:C.gold,color:C.navy,fontSize:9.5,fontWeight:700,padding:'3px 9px',letterSpacing:'0.1em',textTransform:'uppercase'}}>Spécialité</div>}
                <div style={{width:48,height:48,border:`1.5px solid ${C.gold}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <IC size={20} color={C.gold} strokeWidth={1.5}/>
                </div>
                <div>
                  <h3 style={{...serif(),fontSize:18,fontWeight:500,color:C.navy,margin:'0 0 6px'}}>{s.name}</h3>
                  <p style={{...jost(),fontSize:13.5,color:C.gray,lineHeight:1.65,margin:0}}>{s.short}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{textAlign:'center'}}>
          <button onClick={()=>nav('services')} style={{background:'transparent',color:C.navy,border:`1.5px solid ${C.navy}`,padding:'11px 28px',borderRadius:4,cursor:'pointer',fontSize:13.5,fontWeight:500,...jost()}}>
            Voir tous nos soins →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── HOME REVIEWS (3) ─────────────────────────────────
function HomeReviews() {
  return (
    <section className="section-pad" style={{background:C.cream,padding:'80px 24px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <SH tag="Avis Google" title="Ce Que Disent Nos Patients"/>
        <div className="g3">
          {ALL_REVIEWS.slice(0,3).map((r,i)=>(
            <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'24px 24px'}}>
              <div style={{display:'flex',gap:4,marginBottom:12}}>
                {Array(r.rating).fill(0).map((_,j)=><Star key={j} size={14} fill={C.gold} color={C.gold}/>)}
              </div>
              <p style={{...jost(),fontSize:14.5,lineHeight:1.75,color:C.gray,margin:'0 0 18px',fontStyle:'italic'}}>"{r.text}"</p>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{...jost(),fontWeight:600,fontSize:14,color:C.navy}}>{r.name}</div>
                  <div style={{...jost(),fontSize:12,color:C.gold,marginTop:2}}>{r.svc}</div>
                </div>
                <div style={{...jost(),fontSize:11,color:C.gray}}>{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────
function Home({nav}) {
  return <>
    <Hero nav={nav}/>
    <StatsBar/>
    <HomeServices nav={nav}/>
    <HomeReviews/>
    <CTABanner nav={nav}/>
    <MapSection/>
  </>;
}

// ─── SERVICES PAGE ────────────────────────────────────
function ServicesPage({nav}) {
  const [exp, setExp] = useState(null);
  return (
    <div>
      <div className="page-hero-pad" style={{background:C.navy,color:C.white,padding:'60px 24px 52px',textAlign:'center'}}>
        <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.goldL,marginBottom:10}}>Soins & Services</div>
        <h1 className="page-h1" style={{...serif(),fontSize:44,fontWeight:400,color:C.white,margin:'0 0 12px'}}>Des Soins Complets pour Toute la Famille</h1>
        <p style={{...jost(),fontSize:15,color:'rgba(255,255,255,0.62)',maxWidth:500,margin:'0 auto',lineHeight:1.75,fontWeight:300}}>
          Du bilan annuel à la transformation esthétique, chaque soin réalisé avec les technologies les plus avancées.
        </p>
      </div>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'56px 24px'}}>
        <div className="g2">
          {SERVICES.map((s)=>{
            const IC = s.Icon;
            const isExp = exp===s.id;
            return (
              <div key={s.id} style={{border:`1px solid ${isExp?C.gold:C.border}`,borderRadius:8,background:s.premium?C.goldP:C.white,transition:'border-color .2s',overflow:'hidden'}}>
                <div style={{display:'flex',gap:20,padding:'24px 24px'}}>
                  <div style={{width:52,height:52,border:`1.5px solid ${C.gold}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <IC size={22} color={C.gold} strokeWidth={1.5}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <h3 style={{...serif(),fontSize:19,fontWeight:500,color:C.navy,margin:0}}>{s.name}</h3>
                      {s.premium && <span style={{background:C.gold,color:C.navy,fontSize:9.5,fontWeight:700,padding:'2px 8px',borderRadius:20,textTransform:'uppercase',letterSpacing:'0.08em',flexShrink:0}}>Spécialité</span>}
                    </div>
                    <p style={{...jost(),fontSize:14,color:C.gray,lineHeight:1.65,margin:'0 0 14px'}}>{s.short}</p>
                    <button onClick={()=>setExp(isExp?null:s.id)} style={{
                      display:'flex',alignItems:'center',gap:6,
                      background:'transparent',color:isExp?C.gold:C.navy,
                      border:`1px solid ${isExp?C.gold:C.navy}`,
                      padding:'6px 14px',borderRadius:4,cursor:'pointer',fontSize:12.5,...jost(),
                    }}>
                      {isExp?'Voir moins':'Voir plus'}
                      {isExp ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                  </div>
                </div>
                {/* Expanded detail */}
                <div style={{maxHeight:isExp?400:0,opacity:isExp?1:0,overflow:'hidden',transition:'max-height .35s ease,opacity .3s ease'}}>
                  <div style={{padding:'0 24px 24px 92px',borderTop:`1px solid ${C.border}`}}>
                    <p style={{...jost(),fontSize:14,color:C.gray,lineHeight:1.8,margin:'16px 0 16px'}}>{s.long}</p>
                    <button onClick={()=>nav('rdv')} style={{background:C.navy,color:C.white,border:'none',padding:'9px 20px',borderRadius:4,cursor:'pointer',fontSize:13,...jost()}}>
                      Prendre rendez-vous →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CTABanner nav={nav}/>
      <MapSection/>
    </div>
  );
}

// ─── ABOUT PAGE ──────────────────────────────────────
function AboutPage({nav}) {
  const [revPage, setRevPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(ALL_REVIEWS.length/perPage);
  const visible = ALL_REVIEWS.slice(revPage*perPage, revPage*perPage+perPage);

  // Philosophy values
  const values = [
    {Icon:Heart,   title:'Bienveillance',      desc:'Chaque patient est unique. Nous prenons le temps de comprendre vos besoins et de vous accompagner dans un environnement serein et chaleureux.'},
    {Icon:Zap,     title:'Excellence Technique',desc:'Formation continue en Europe, technologies de pointe et matériaux premium. Nous n\'acceptons rien de moins que le meilleur pour nos patients.'},
    {Icon:Shield,  title:'Soins Sans Douleur',  desc:'Anesthésies locales ultraprécises, sédation consciente disponible. Votre confort est notre priorité absolue à chaque étape du traitement.'},
    {Icon:Check,title:'Transparence',     desc:'Diagnostic honnête, plan de traitement détaillé, devis clair avant toute intervention. Vous décidez en toute connaissance de cause.'},
    {Icon:Award,   title:'Innovation',          desc:`Scanner 3Shape, CBCT 3D, Digital Smile Design, planification digitale. Le futur de la dentisterie, accessible dès aujourd'hui à ${CONFIG.city}.`},
    {Icon:Users,   title:'Suivi Personnalisé',  desc:'De la première consultation au suivi post-traitement, votre parcours est tracé et votre dossier suivi avec la plus grande attention.'},
  ];

  // Photos du cabinet — dérivées de CONFIG.aboutImages (URL vide = placeholder "Photo à venir")
  const clinicPhotos = CONFIG.aboutImages;

  // Équipe — Dr. + staff dérivés de CONFIG
  const team = [
    {initials:'KF', name:CONFIG.doctorName,  role:'Chirurgien-Dentiste & Orthodontiste', desc:'Fondatrice du cabinet, spécialiste orthodontie et implantologie. Invisalign Provider, certifiée Damon, DSD.'},
    ...CONFIG.staff.map(s=>({initials:s.initials, name:s.name, role:s.role, desc:s.desc})),
  ];

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero-pad" style={{background:C.navy,color:C.white,padding:'60px 24px 52px',textAlign:'center'}}>
        <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.goldL,marginBottom:10}}>À Propos</div>
        <h1 className="page-h1" style={{...serif(),fontSize:44,fontWeight:400,color:C.white,margin:'0 0 12px'}}>{CONFIG.cabinetNameFull}</h1>
        <p style={{...jost(),fontSize:15,color:'rgba(255,255,255,0.62)',maxWidth:500,margin:'0 auto',lineHeight:1.75,fontWeight:300}}>
          Un cabinet d'excellence à {CONFIG.city}, dédié à votre santé bucco-dentaire et à la beauté de votre sourire.
        </p>
      </div>

      {/* SECTION 1 — Dr. Présentation */}
      <section className="section-pad" style={{background:C.white,padding:'72px 24px'}}>
        <div className="gabout" style={{maxWidth:1080,margin:'0 auto'}}>
          {/* Profile card */}
          <div style={{background:C.navy,borderRadius:10,padding:'30px 24px',textAlign:'center',color:C.white}}>
            <div style={{width:88,height:88,borderRadius:'50%',background:'rgba(191,154,85,0.18)',border:`2px solid ${C.gold}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',...serif(),fontSize:30,color:C.goldL}}>KF</div>
            <div style={{...serif(),fontSize:19,fontWeight:500}}>{CONFIG.doctorName}</div>
            <div style={{...jost(),fontSize:12.5,color:C.goldL,margin:'4px 0 2px'}}>Chirurgien-Dentiste & Orthodontiste</div>
            <div style={{...jost(),fontSize:11.5,color:'rgba(255,255,255,0.42)',marginBottom:20}}>{CONFIG.city}, {CONFIG.country}</div>
            <div style={{borderTop:'1px solid rgba(191,154,85,0.2)',paddingTop:16,marginBottom:16}}>
              <div style={{...jost(),fontSize:10.5,color:C.gold,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:8}}>Formation</div>
              <div style={{...jost(),fontSize:13,color:'rgba(255,255,255,0.75)',lineHeight:1.7}}>
                Faculté de Médecine Dentaire<br/>Université Mohammed V · Rabat<br/>Doctorat en Chirurgie Dentaire
              </div>
            </div>
            <div style={{borderTop:'1px solid rgba(191,154,85,0.2)',paddingTop:16}}>
              {[{l:'Expérience',v:'+5 ans'},{l:'Patients traités',v:'500+'},{l:'Note Google',v:'4.9/5'}].map((s,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  <span style={{...jost(),fontSize:12,color:'rgba(255,255,255,0.55)'}}>{s.l}</span>
                  <span style={{...jost(),fontSize:12,fontWeight:600,color:C.goldL}}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bio */}
          <div>
            <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.gold,marginBottom:14}}>{CONFIG.doctorName}</div>
            <h2 style={{...serif(),fontSize:32,fontWeight:400,color:C.navy,margin:'0 0 18px',lineHeight:1.2}}>Une Spécialiste Engagée pour l'Excellence Dentaire</h2>
            <p style={{...jost(),fontSize:15,color:C.gray,lineHeight:1.9,marginBottom:16}}>
              Lauréate de la Faculté de Médecine Dentaire de l'Université Mohammed V de Rabat, le {CONFIG.doctorName} a développé une expertise reconnue en orthodontie et esthétique dentaire. Passionnée par la dentisterie numérique, elle suit régulièrement des formations en Europe pour maîtriser les techniques les plus avancées.
            </p>
            <p style={{...jost(),fontSize:15,color:C.gray,lineHeight:1.9,marginBottom:28}}>
              Au {CONFIG.cabinetNameFull}, chaque patient bénéficie d'un diagnostic numérique précis (scanner 3Shape, CBCT 3D) et d'un plan de traitement entièrement personnalisé. La simulation du résultat avant chaque intervention garantit une transparence totale.
            </p>
            <h3 style={{...serif(),fontSize:20,fontWeight:500,color:C.navy,margin:'0 0 16px'}}>Certifications & Spécialisations</h3>
            <div className="g2" style={{gap:10}}>
              {['Orthodontiste certifiée — Système Damon','Invisalign Provider certifiée','Digital Smile Design (DSD)','Implantologie numérique digitalisée','Scanner intra-oral 3Shape','Sédation consciente (vigile)','Radiologie avancée — CBCT 3D'].map((c,i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8}}>
                  <div style={{width:16,height:16,borderRadius:'50%',border:`1.5px solid ${C.gold}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:C.gold}}/>
                  </div>
                  <span style={{...jost(),fontSize:13.5,color:C.gray,lineHeight:1.5}}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Philosophie & Valeurs */}
      <section className="section-pad" style={{background:C.navy,padding:'72px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.goldL,marginBottom:10}}>Notre Philosophie</div>
            <h2 className="section-h2" style={{...serif(),fontSize:38,fontWeight:400,color:C.white,margin:'0 0 12px'}}>Valeurs & Engagement</h2>
            <p style={{...jost(),fontSize:15.5,color:'rgba(255,255,255,0.6)',maxWidth:500,margin:'0 auto',lineHeight:1.75,fontWeight:300}}>
              "Mon approche se base sur l'écoute, la prévention et l'excellence technique. Chaque sourire mérite le meilleur." — {CONFIG.doctorShortName}
            </p>
          </div>
          <div className="g3">
            {values.map((v,i)=>{
              const IC = v.Icon;
              return (
                <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(191,154,85,0.2)',borderRadius:8,padding:'26px 22px'}}>
                  <div style={{width:44,height:44,border:`1px solid ${C.gold}`,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
                    <IC size={20} color={C.gold} strokeWidth={1.5}/>
                  </div>
                  <h3 style={{...serif(),fontSize:18,fontWeight:500,color:C.white,margin:'0 0 8px'}}>{v.title}</h3>
                  <p style={{...jost(),fontSize:13.5,color:'rgba(255,255,255,0.62)',lineHeight:1.7,margin:0}}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Espace Clinique */}
      <section className="section-pad" style={{background:C.cream,padding:'72px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH tag="Notre Cabinet" title="Un Espace Conçu pour Votre Confort" sub="Technologies de pointe dans un environnement serein et accueillant, pensé pour que chaque visite soit une expérience positive."/>
          <div className="gclinic">
            {clinicPhotos.filter(p=>p.url).map((p,i)=>(
              <div key={i} style={{aspectRatio:'4/3',borderRadius:8,border:'1px solid rgba(191,154,85,0.2)',overflow:'hidden'}}>
                <img src={p.url} alt={p.label} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Équipe */}
      <section className="section-pad" style={{background:C.white,padding:'72px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <SH tag="Notre Équipe" title="Des Professionnels à Votre Service"/>
          <div className="g3">
            {team.map((m,i)=>(
              <div key={i} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:'28px 22px',textAlign:'center'}}>
                <div style={{width:72,height:72,borderRadius:'50%',background:i===0?C.navy:`rgba(191,154,85,0.12)`,border:`2px solid ${C.gold}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',...serif(),fontSize:22,color:i===0?C.goldL:C.gold,fontWeight:400}}>
                  {m.initials}
                </div>
                <div style={{...serif(),fontSize:17,fontWeight:500,color:C.navy,marginBottom:4}}>{m.name}</div>
                <div style={{...jost(),fontSize:12.5,color:C.gold,marginBottom:12}}>{m.role}</div>
                <p style={{...jost(),fontSize:13.5,color:C.gray,lineHeight:1.65,margin:0}}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Avis patients */}
      <section className="section-pad" style={{background:C.goldP,padding:'72px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH tag="Avis Google" title="La Confiance de Nos Patients"/>
          <div className="g3" style={{marginBottom:28}}>
            {visible.map((r,i)=>(
              <div key={`${revPage}-${i}`} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:8,padding:'22px 22px',animation:'fadeSlide .3s ease'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <div style={{width:40,height:40,borderRadius:'50%',background:C.navy,display:'flex',alignItems:'center',justifyContent:'center',...jost(),fontSize:14,fontWeight:600,color:C.goldL}}>{r.initials}</div>
                    <div>
                      <div style={{...jost(),fontWeight:600,fontSize:14,color:C.navy}}>{r.name}</div>
                      <div style={{...jost(),fontSize:11,color:C.gray}}>{r.date}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:2}}>
                    {Array(r.rating).fill(0).map((_,j)=><Star key={j} size={12} fill={C.gold} color={C.gold}/>)}
                  </div>
                </div>
                <p style={{...jost(),fontSize:13.5,lineHeight:1.75,color:C.gray,margin:'0 0 10px',fontStyle:'italic'}}>"{r.text}"</p>
                <div style={{...jost(),fontSize:12,color:C.gold}}>{r.svc}</div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:16}}>
            <button onClick={()=>setRevPage(p=>Math.max(0,p-1))} disabled={revPage===0} style={{background:revPage===0?C.grayL:C.navy,color:revPage===0?C.gray:C.white,border:'none',borderRadius:'50%',width:40,height:40,cursor:revPage===0?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ArrowLeft size={16}/>
            </button>
            <div style={{display:'flex',gap:8}}>
              {Array(pages).fill(0).map((_,i)=>(
                <button key={i} onClick={()=>setRevPage(i)} style={{width:10,height:10,borderRadius:'50%',background:revPage===i?C.gold:C.border,border:'none',cursor:'pointer',padding:0}}/>
              ))}
            </div>
            <button onClick={()=>setRevPage(p=>Math.min(pages-1,p+1))} disabled={revPage===pages-1} style={{background:revPage===pages-1?C.grayL:C.navy,color:revPage===pages-1?C.gray:C.white,border:'none',borderRadius:'50%',width:40,height:40,cursor:revPage===pages-1?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ArrowRight size={16}/>
            </button>
          </div>
        </div>
        <style>{`@keyframes fadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </section>
    </div>
  );
}

// ─── RDV FORM (shared by ContactPage) ─────────────────
function RDVForm({addRequest}) {
  const init = {customer_name:'',phone:'',service_type:'',description:'',preferred_date:'',preferred_time:''};
  const [form, setForm]   = useState(init);
  const [sub, setSub]     = useState(false);
  const [loading, setLd]  = useState(false);
  const [errors, setErrs] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);

  const set = (k,v) => {
    const nf = {...form,[k]:v};
    if (k==='preferred_date') {
      setTimeSlots(getTimeSlots(v));
      nf.preferred_time = '';
      // Block Sunday
      if (v && new Date(v+'T00:00:00').getDay()===0) { setErrs(e=>({...e,preferred_date:'Les dimanches ne sont pas disponibles.'})); }
      else { setErrs(e=>({...e,preferred_date:null})); }
    }
    setForm(nf);
    if (k!=='preferred_date') setErrs(e=>({...e,[k]:null}));
  };

  const validate = () => {
    const e={};
    if (!form.customer_name.trim()) e.customer_name='Champ obligatoire';
    if (!form.phone.trim()) e.phone='Champ obligatoire';
    if (!form.service_type) e.service_type='Veuillez choisir un soin';
    if (!form.preferred_date) e.preferred_date='Champ obligatoire';
    else if (new Date(form.preferred_date+'T00:00:00').getDay()===0) e.preferred_date='Les dimanches ne sont pas disponibles.';
    if (!form.preferred_time) e.preferred_time='Veuillez choisir une heure';
    return e;
  };

  const submit = () => {
    const errs = validate();
    if (Object.keys(errs).length>0) { setErrs(errs); return; }
    setLd(true);
    setTimeout(()=>{ addRequest(form); setLd(false); setSub(true); },900);
  };

  const inp = f => ({width:'100%',padding:'11px 14px',border:`1px solid ${errors[f]?C.err:C.border}`,borderRadius:6,fontSize:14,color:C.navy,background:C.white,outline:'none',boxSizing:'border-box',...jost()});
  const lbl = {...jost(),display:'block',fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:C.navy,marginBottom:5};

  if (sub) return (
    <div style={{background:C.white,borderRadius:12,border:`1px solid ${C.border}`,padding:'40px 32px',textAlign:'center'}}>
      <div style={{width:56,height:56,background:'#ECFDF5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px',fontSize:24,color:C.ok}}>✓</div>
      <h3 style={{...serif(),fontSize:26,fontWeight:400,color:C.navy,margin:'0 0 10px'}}>Demande Envoyée !</h3>
      <p style={{...jost(),fontSize:14.5,color:C.gray,lineHeight:1.7,margin:'0 0 24px'}}>
        Merci {form.customer_name.split(' ')[0]} ! Notre équipe vous contactera sous 24h pour confirmer votre rendez-vous.
      </p>
      <div style={{background:C.goldP,borderRadius:8,padding:'12px 16px',marginBottom:24,textAlign:'left'}}>
        <div style={{...jost(),fontSize:14,color:C.navy,fontWeight:600}}>{form.service_type}</div>
        <div style={{...jost(),fontSize:13,color:C.gray}}>{form.preferred_date ? `Le ${fmtDate(form.preferred_date)} à ${form.preferred_time}` : ''}</div>
      </div>
      <button onClick={()=>{setSub(false);setForm(init);setTimeSlots([]);}} style={{background:C.navy,color:C.white,border:'none',padding:'11px 24px',borderRadius:4,cursor:'pointer',fontSize:13,...jost()}}>
        Nouveau Rendez-vous
      </button>
    </div>
  );

  return (
    <div style={{background:C.white,borderRadius:12,border:`1px solid ${C.border}`,padding:'32px 32px'}}>
      <h3 style={{...serif(),fontSize:24,fontWeight:400,color:C.navy,margin:'0 0 24px'}}>Réservez votre Consultation</h3>
      <div className="gform2" style={{marginBottom:18}}>
        <div>
          <label style={lbl}>Nom complet <span style={{color:C.err}}>*</span></label>
          <input type="text" value={form.customer_name} onChange={e=>set('customer_name',e.target.value)} placeholder="Ex : Fatima El Amrani" style={inp('customer_name')}/>
          {errors.customer_name && <div style={{...jost(),fontSize:12,color:C.err,marginTop:4}}>{errors.customer_name}</div>}
        </div>
        <div>
          <label style={lbl}>Téléphone <span style={{color:C.err}}>*</span></label>
          <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="Ex : 0612 345 678" style={inp('phone')}/>
          {errors.phone && <div style={{...jost(),fontSize:12,color:C.err,marginTop:4}}>{errors.phone}</div>}
        </div>
      </div>
      <div style={{marginBottom:18}}>
        <label style={lbl}>Soin souhaité <span style={{color:C.err}}>*</span></label>
        <select value={form.service_type} onChange={e=>set('service_type',e.target.value)} style={{...inp('service_type'),cursor:'pointer'}}>
          <option value="">— Choisissez un soin —</option>
          {SERVICES.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        {errors.service_type && <div style={{...jost(),fontSize:12,color:C.err,marginTop:4}}>{errors.service_type}</div>}
      </div>
      <div className="gform2" style={{marginBottom:18}}>
        <div>
          <label style={lbl}>Date souhaitée <span style={{color:C.err}}>*</span></label>
          <input type="date" value={form.preferred_date} min={getMinDate()} onChange={e=>set('preferred_date',e.target.value)} style={inp('preferred_date')}/>
          {errors.preferred_date && <div style={{...jost(),fontSize:12,color:C.err,marginTop:4}}>{errors.preferred_date}</div>}
          {form.preferred_date && !errors.preferred_date && (
            <div style={{...jost(),fontSize:11.5,color:C.gray,marginTop:4}}>
              {new Date(form.preferred_date+'T00:00:00').getDay()===6 ? `🗓 Samedi — ${hFull(CONFIG.hours.saturdayOpen)} à ${hFull(CONFIG.hours.saturdayClose)}` : `🗓 Lundi–Vendredi — ${hFull(CONFIG.hours.weekdayOpen)} à ${hFull(CONFIG.hours.weekdayClose)}`}
            </div>
          )}
        </div>
        <div>
          <label style={lbl}>Heure préférée <span style={{color:C.err}}>*</span></label>
          <select value={form.preferred_time} onChange={e=>set('preferred_time',e.target.value)} disabled={!form.preferred_date||!!errors.preferred_date} style={{...inp('preferred_time'),cursor:'pointer',background:!form.preferred_date?C.grayL:C.white}}>
            <option value="">— Choisissez une heure —</option>
            {timeSlots.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          {errors.preferred_time && <div style={{...jost(),fontSize:12,color:C.err,marginTop:4}}>{errors.preferred_time}</div>}
          {form.preferred_date && !errors.preferred_date && timeSlots.length===0 && (
            <div style={{...jost(),fontSize:12,color:C.err,marginTop:4}}>Plus aucun créneau disponible pour aujourd'hui. Merci de choisir une autre date.</div>
          )}
        </div>
      </div>
      <div style={{marginBottom:24}}>
        <label style={lbl}>Message (optionnel)</label>
        <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Décrivez votre problème ou vos questions..." rows={3} style={{...inp('description'),resize:'vertical',lineHeight:1.65}}/>
      </div>
      <button type="button" onClick={submit} disabled={loading} style={{width:'100%',background:loading?C.gray:C.navy,color:C.white,border:'none',padding:'14px 24px',borderRadius:6,cursor:loading?'not-allowed':'pointer',fontSize:14,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',...jost()}}>
        {loading?'Envoi en cours...':'Envoyer ma Demande'}
      </button>
      <p style={{...jost(),textAlign:'center',fontSize:11.5,color:C.gray,marginTop:12}}>🔒 Données confidentielles — Réponse sous 24h</p>
    </div>
  );
}

// ─── CONTACT PAGE ────────────────────────────────────
function ContactPage({nav, addRequest}) {
  const hours = [
    {d:'Lundi — Vendredi', h:`${hFull(CONFIG.hours.weekdayOpen)} – ${hFull(CONFIG.hours.weekdayClose)}`},
    {d:'Samedi',           h:`${hFull(CONFIG.hours.saturdayOpen)} – ${hFull(CONFIG.hours.saturdayClose)}`},
    {d:'Dimanche',         h:'Fermé'},
    {d:'Urgences',         h:'7j/7 (Patients)'},
  ];

  return (
    <div>
      <div className="page-hero-pad" style={{background:C.navy,color:C.white,padding:'60px 24px 52px',textAlign:'center'}}>
        <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.goldL,marginBottom:10}}>Contact</div>
        <h1 className="page-h1" style={{...serif(),fontSize:44,fontWeight:400,color:C.white,margin:'0 0 12px'}}>Contactez-Nous</h1>
        <p style={{...jost(),fontSize:15,color:'rgba(255,255,255,0.62)',maxWidth:460,margin:'0 auto',fontWeight:300}}>
          Réponse garantie sous 24h. Urgences prises en charge le jour même.
        </p>
      </div>

      {/* SECTION 1 — Contact info */}
      <section className="section-pad" style={{background:C.white,padding:'60px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SH tag="Nous Contacter" title="Choisissez Votre Moyen Préféré"/>
          {/* 3 contact cards */}
          <div className="g3" style={{marginBottom:40}}>
            {[
              {Icon:Phone, label:'Appel Téléphonique', val:CONFIG.phoneDisplay, sub:`Lun–Ven ${hShort(CONFIG.hours.weekdayOpen)}–${hShort(CONFIG.hours.weekdayClose)} | Sam ${hShort(CONFIG.hours.saturdayOpen)}–${hShort(CONFIG.hours.saturdayClose)}`, href:`tel:${CONFIG.phoneHref}`, color:'#2563EB', bg:'#EFF6FF'},
              {Icon:WAIcon, label:'WhatsApp', val:CONFIG.phoneDisplay, sub:'Réponse rapide garantie', href:`https://wa.me/${CONFIG.whatsappNumber}`, color:'#16A34A', bg:'#F0FDF4'},
              {Icon:Mail, label:'Email', val:CONFIG.email, sub:'Réponse sous 24h', href:`mailto:${CONFIG.email}`, color:C.gold, bg:C.goldP},
            ].map((c,i)=>{
              const IC = c.Icon;
              return (
                <a key={i} href={c.href} style={{display:'block',padding:'24px 22px',border:`1px solid ${C.border}`,borderRadius:10,background:C.white,textDecoration:'none',transition:'border-color .2s'}} onMouseEnter={e=>e.currentTarget.style.borderColor=c.color} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <div style={{width:48,height:48,borderRadius:'50%',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                    <IC size={20} color={c.color} strokeWidth={typeof IC==='function'?undefined:1.5}/>
                  </div>
                  <div style={{...jost(),fontSize:12,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:C.gray,marginBottom:4}}>{c.label}</div>
                  <div style={{...jost(),fontSize:15,fontWeight:600,color:C.navy,marginBottom:4}}>{c.val}</div>
                  <div style={{...jost(),fontSize:12.5,color:C.gray}}>{c.sub}</div>
                </a>
              );
            })}
          </div>
          {/* Address + Hours */}
          <div className="g2">
            <div style={{padding:'24px 24px',background:C.grayL,borderRadius:10}}>
              <div style={{display:'flex',gap:12,marginBottom:12,alignItems:'flex-start'}}>
                <MapPin size={20} color={C.gold} strokeWidth={1.5} style={{flexShrink:0,marginTop:2}}/>
                <div>
                  <div style={{...jost(),fontSize:12,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:C.gray,marginBottom:4}}>Adresse</div>
                  <div style={{...jost(),fontSize:14.5,color:C.navy,lineHeight:1.7}}>
                    {CONFIG.addressLines.map((line,i)=>(<Fragment key={i}>{line}{i<CONFIG.addressLines.length-1 && <br/>}</Fragment>))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{padding:'24px 24px',background:C.grayL,borderRadius:10}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <Clock size={20} color={C.gold} strokeWidth={1.5} style={{flexShrink:0,marginTop:2}}/>
                <div>
                  <div style={{...jost(),fontSize:12,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:C.gray,marginBottom:10}}>Horaires</div>
                  {hours.map((h,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:i<hours.length-1?`1px solid ${C.border}`:'none'}}>
                      <span style={{...jost(),fontSize:13.5,color:C.gray}}>{h.d}</span>
                      <span style={{...jost(),fontSize:13.5,fontWeight:600,color:h.h==='Fermé'?C.err:C.navy}}>{h.h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — RDV Form */}
      <section className="section-pad" style={{background:C.cream,padding:'60px 24px'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:36}}>
            <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.gold,marginBottom:10}}>Prise de Rendez-vous</div>
            <h2 className="section-h2" style={{...serif(),fontSize:34,fontWeight:400,color:C.navy}}>Réservez votre Consultation</h2>
          </div>
          <RDVForm addRequest={addRequest}/>
        </div>
      </section>

      {/* SECTION 3 — Map interactive */}
      <MapSection/>
    </div>
  );
}

// ─── PAGE RDV DÉDIÉE ─────────────────────────────────
function RDVPage({addRequest}) {
  return (
    <div style={{minHeight:'80vh',background:C.cream}}>
      {/* Page hero */}
      <div className="page-hero-pad" style={{background:C.navy,color:C.white,padding:'60px 24px 52px',textAlign:'center'}}>
        <div style={{...jost(),fontSize:11.5,letterSpacing:'0.22em',textTransform:'uppercase',color:C.goldL,marginBottom:10}}>
          {CONFIG.cabinetNameFull}
        </div>
        <h1 className="page-h1" style={{...serif(),fontSize:44,fontWeight:400,color:C.white,margin:'0 0 12px'}}>
          Prendre Rendez-vous
        </h1>
        <p style={{...jost(),fontSize:15,color:'rgba(255,255,255,0.62)',maxWidth:460,margin:'0 auto',fontWeight:300,lineHeight:1.75}}>
          Remplissez le formulaire ci-dessous. Notre équipe vous confirmera votre rendez-vous sous 24h.
        </p>
        {/* Quick info badges */}
        <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:24,flexWrap:'wrap'}}>
          {[{icon:Clock,t:'Réponse sous 24h'},{icon:Phone,t:'Confirmation par tél.'},{icon:MapPin,t:`${CONFIG.city} Centre`}].map((b,i)=>{
            const IC = b.icon;
            return (
              <div key={i} style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(191,154,85,0.15)',border:'1px solid rgba(191,154,85,0.28)',borderRadius:20,padding:'6px 14px'}}>
                <IC size={13} color={C.goldL} strokeWidth={1.5}/>
                <span style={{...jost(),fontSize:12,color:C.goldL}}>{b.t}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Form */}
      <div style={{maxWidth:720,margin:'0 auto',padding:'52px 24px'}}>
        <RDVForm addRequest={addRequest}/>
      </div>
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────
function Footer({nav}) {
  const links = [{id:'home',l:'Accueil'},{id:'services',l:'Soins & Services'},{id:'about',l:'À propos'},{id:'contact',l:'Contact'}];
  const hours = [`Lundi — Vendredi : ${hShort(CONFIG.hours.weekdayOpen)} – ${hShort(CONFIG.hours.weekdayClose)}`,`Samedi : ${hShort(CONFIG.hours.saturdayOpen)} – ${hShort(CONFIG.hours.saturdayClose)}`,'Dimanche : Fermé','Urgences : 7j/7'];
  return (
    <footer style={{background:C.navy,color:C.white,padding:'52px 24px 24px',...jost()}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="gfooter" style={{marginBottom:36}}>
          {/* Brand */}
          <div>
            <div style={{...serif(),fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:C.gold,marginBottom:5}}>Centre Dentaire</div>
            <div style={{...serif(),fontSize:20,fontWeight:500,color:C.white,marginBottom:12}}>{CONFIG.cabinetName}</div>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.85,maxWidth:240,marginBottom:20}}>
              Cabinet dentaire d'excellence à {CONFIG.city}. Orthodontie, Invisalign, esthétique et implantologie.
            </p>
            {/* Social icons */}
            <div style={{display:'flex',gap:10}}>
              {[
                {Icon:FacebookIcon,  href:CONFIG.social.facebook,   label:'Facebook',  c:'#1877F2'},
                {Icon:InstagramIcon, href:CONFIG.social.instagram,  label:'Instagram', c:'#E1306C'},
                {Icon:LinkedinIcon,  href:CONFIG.social.linkedin,   label:'LinkedIn',  c:'#0A66C2'},
                {Icon:WAIcon,    href:`https://wa.me/${CONFIG.whatsappNumber}`, label:'WhatsApp', c:'#25D366'},
              ].map((s,i)=>{
                const IC = s.Icon;
                return (
                  <a key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                    style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.background=s.c+'33'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
                    <IC size={16} color={C.white}/>
                  </a>
                );
              })}
            </div>
          </div>
          {/* Navigation */}
          <div>
            <div style={{fontSize:10.5,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:14}}>Navigation</div>
            {links.map(l=>(
              <button key={l.id} onClick={()=>nav(l.id)} style={{display:'block',background:'none',border:'none',cursor:'pointer',fontSize:13,color:'rgba(255,255,255,0.55)',padding:'3.5px 0',textAlign:'left',...jost()}}>
                {l.l}
              </button>
            ))}
          </div>
          {/* Horaires */}
          <div>
            <div style={{fontSize:10.5,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:14}}>Horaires</div>
            {hours.map((h,i)=>(
              <div key={i} style={{fontSize:13,color:'rgba(255,255,255,0.55)',lineHeight:1.9}}>{h}</div>
            ))}
          </div>
          {/* Contact */}
          <div>
            <div style={{fontSize:10.5,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:14}}>Contact</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <a href={`tel:${CONFIG.phoneHref}`} style={{display:'flex',alignItems:'center',gap:8,color:'rgba(255,255,255,0.6)',fontSize:13,textDecoration:'none'}}>
                <Phone size={13} color={C.gold}/> {CONFIG.phoneDisplay}
              </a>
              <a href={`mailto:${CONFIG.email}`} style={{display:'flex',alignItems:'center',gap:8,color:'rgba(255,255,255,0.6)',fontSize:13,textDecoration:'none'}}>
                <Mail size={13} color={C.gold}/> {CONFIG.email}
              </a>
              <div style={{display:'flex',alignItems:'flex-start',gap:8,color:'rgba(255,255,255,0.6)',fontSize:13}}>
                <MapPin size={13} color={C.gold} style={{marginTop:2,flexShrink:0}}/> {CONFIG.addressShort}
              </div>
            </div>
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:18,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.3)'}}>
            © 2026 {CONFIG.cabinetNameFull} — {CONFIG.doctorName}. Tous droits réservés.
          </div>
          <button onClick={()=>nav('admin')} style={{background:'transparent',color:'rgba(255,255,255,0.25)',border:'1px solid rgba(255,255,255,0.1)',padding:'4px 12px',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,...jost()}}>
            Espace Admin
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─── ADMIN LOGIN ─────────────────────────────────────
function AdminLogin({onLogin}) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd]     = useState('');
  const [err, setErr]     = useState('');
  const doLogin = () => {
    if (email.trim()===CONFIG.crmAuth.email && pwd===CONFIG.crmAuth.password) { onLogin(); }
    else { setErr('Identifiants incorrects.'); }
  };
  const iS = {width:'100%',padding:'12px 14px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:14,color:C.navy,background:C.white,outline:'none',boxSizing:'border-box',marginBottom:16,...jost()};
  const lS = {...jost(),display:'block',fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:C.gray,marginBottom:6};
  return (
    <div style={{minHeight:'100vh',background:C.navy,display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{...serif(),fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:C.gold,marginBottom:6}}>Centre Dentaire</div>
          <div style={{...serif(),fontSize:22,fontWeight:500,color:C.white,marginBottom:6}}>{CONFIG.cabinetName}</div>
          <div style={{...jost(),fontSize:13,color:'rgba(255,255,255,0.45)'}}>Espace Professionnel — CRM</div>
        </div>
        <div style={{background:C.white,borderRadius:12,padding:'32px 32px'}}>
          <h2 style={{...serif(),fontSize:22,fontWeight:400,color:C.navy,margin:'0 0 20px',textAlign:'center'}}>Connexion</h2>
          <label style={lS}>Email</label>
          <input type="text" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="votre@email.com" style={iS}/>
          <label style={lS}>Mot de passe</label>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="••••••••••••" style={iS}/>
          {err && <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:6,padding:'10px 14px',...jost(),fontSize:13,color:'#991B1B',marginBottom:14}}>{err}</div>}
          <button type="button" onClick={doLogin} style={{width:'100%',background:C.navy,color:C.white,border:'none',padding:'13px',borderRadius:6,cursor:'pointer',fontSize:14,fontWeight:600,...jost()}}>
            Se Connecter
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CRM DASHBOARD ───────────────────────────────────
function CRMDashboard({requests, updateRequest, nav, logout}) {
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState('newest');
  const [selected, setSel]    = useState(null);
  const [noteText, setNote]   = useState('');
  const [statusMenuFor, setStatusMenuFor] = useState(null);

  // Ferme le menu déroulant de statut si on clique en dehors
  useEffect(()=>{
    if (!statusMenuFor) return;
    const close = () => setStatusMenuFor(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [statusMenuFor]);

  // Badge de statut cliquable → menu déroulant avec les 5 statuts (mêmes couleurs)
  const StatusDropdown = ({req}) => {
    const cfg = STATUS[req.status]||STATUS['Nouveau'];
    const isOpen = statusMenuFor === req.id;
    const changeStatus = (s) => {
      updateRequest(req.id,{status:s});
      if (selected && selected.id===req.id) setSel({...selected,status:s});
      setStatusMenuFor(null);
    };
    return (
      <div style={{position:'relative',display:'inline-block'}}>
        <button onClick={e=>{e.stopPropagation();setStatusMenuFor(isOpen?null:req.id);}} style={{background:cfg.bg,color:cfg.color,padding:'3px 8px 3px 10px',borderRadius:20,fontSize:12,fontWeight:500,display:'inline-flex',alignItems:'center',gap:5,border:'none',cursor:'pointer',...jost()}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:cfg.dot,display:'inline-block'}}/>{req.status}
          <ChevronDown size={12}/>
        </button>
        {isOpen && (
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:'calc(100% + 4px)',left:0,zIndex:30,background:C.white,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:'0 6px 20px rgba(0,0,0,0.14)',padding:5,minWidth:150}}>
            {STATUSES.map(s=>{
              const scfg = STATUS[s];
              return (
                <button key={s} onClick={()=>changeStatus(s)} style={{display:'flex',alignItems:'center',gap:6,width:'100%',padding:'7px 10px',border:'none',background:req.status===s?scfg.bg:'transparent',color:scfg.color,borderRadius:6,cursor:'pointer',fontSize:12.5,fontWeight:500,textAlign:'left',...jost()}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:scfg.dot,display:'inline-block'}}/>{s}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const filtered = requests
    .filter(r=>filter==='all'||r.status===filter)
    .filter(r=>!search||r.customer_name.toLowerCase().includes(search.toLowerCase())||r.phone.includes(search)||r.service_type.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>sort==='newest'?new Date(b.created_at)-new Date(a.created_at):sort==='oldest'?new Date(a.created_at)-new Date(b.created_at):a.customer_name.localeCompare(b.customer_name));

  const counts = STATUSES.reduce((acc,s)=>{acc[s]=requests.filter(r=>r.status===s).length;return acc;},{});

  // Export de la liste (filtrée) au format CSV, compatible Excel (séparateur ';' + BOM UTF-8 pour les accents)
  const exportToExcel = () => {
    const headers = ['Date de création','Patient','Téléphone','Soin','Date RDV','Heure RDV','Statut','Notes internes','Message patient'];
    const esc = v => `"${String(v??'').replace(/"/g,'""')}"`;
    const rows = filtered.map(r=>[
      fmtFull(r.created_at), r.customer_name, r.phone, r.service_type,
      r.preferred_date?fmtDate(r.preferred_date):'', r.preferred_time||'',
      r.status, r.notes||'', r.description||''
    ]);
    const csv = [headers,...rows].map(row=>row.map(esc).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `demandes-rdv-${getTodayStr()}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{minHeight:'100vh',background:C.grayL,...jost()}}>
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:'0 20px',height:62,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={()=>nav('home')} style={{background:'none',border:'none',cursor:'pointer',...serif(),fontSize:18,color:C.gold}}>◇</button>
          <div>
            <div style={{...serif(),fontSize:15,fontWeight:600,color:C.navy}}>{CONFIG.cabinetNameFull}</div>
            <div style={{fontSize:11,color:C.gray}}>CRM — Demandes RDV</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:13,color:C.gray}}>{CONFIG.doctorName}</span>
          <button onClick={logout} style={{background:'transparent',color:C.gray,border:`1px solid ${C.border}`,padding:'6px 14px',borderRadius:4,cursor:'pointer',fontSize:12}}>Déconnexion</button>
        </div>
      </div>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'20px 20px'}}>
        {/* Stats */}
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:18}}>
          {[{k:'all',l:'Total',v:requests.length,dot:C.navy},...STATUSES.map(s=>({k:s,l:s,v:counts[s]||0,dot:STATUS[s].dot}))].map((st,i)=>(
            <div key={i} onClick={()=>setFilter(st.k)} style={{background:C.white,border:`1.5px solid ${filter===st.k?st.dot:C.border}`,borderRadius:8,padding:'12px 18px',cursor:'pointer',minWidth:90}}>
              <div style={{...serif(),fontSize:24,fontWeight:600,color:filter===st.k?st.dot:C.navy,lineHeight:1}}>{st.v}</div>
              <div style={{fontSize:12,color:C.gray,marginTop:3}}>{st.l}</div>
            </div>
          ))}
        </div>
        {/* Search & sort */}
        <div style={{background:C.white,borderRadius:8,border:`1px solid ${C.border}`,padding:'12px 16px',marginBottom:12,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{flex:1,minWidth:180,padding:'8px 12px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:13,color:C.navy,outline:'none',...jost()}}/>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:'8px 12px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:13,color:C.navy,background:C.white,cursor:'pointer',outline:'none',...jost()}}>
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="name">Nom A→Z</option>
          </select>
          <span style={{fontSize:13,color:C.gray}}>{filtered.length} résultat{filtered.length!==1?'s':''}</span>
          <button onClick={exportToExcel} style={{display:'flex',alignItems:'center',gap:7,background:'#217346',color:C.white,border:'none',padding:'8px 16px',borderRadius:6,cursor:'pointer',fontSize:12.5,fontWeight:600,...jost()}}>
            <Download size={14}/> Exporter Excel
          </button>
        </div>
        {/* Table */}
        <div style={{background:C.white,borderRadius:8,border:`1px solid ${C.border}`,overflow:'auto',marginBottom:14}}>
          {filtered.length===0 ? (
            <div style={{padding:'48px 24px',textAlign:'center',color:C.gray}}>
              <div style={{fontSize:32,color:C.gold,marginBottom:8}}>◇</div>
              <div style={{fontSize:15,fontWeight:500,color:C.navy}}>{requests.length===0?'Aucune demande':'Aucun résultat'}</div>
            </div>
          ) : (
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{background:C.grayL,borderBottom:`1px solid ${C.border}`}}>
                  {['Date de création','Patient','Téléphone','Soin','Date & Heure du RDV','Statut',''].map(h=>(
                    <th key={h} style={{padding:'11px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:C.gray,letterSpacing:'0.1em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((req,i)=>{
                  const isOpen = selected && selected.id===req.id;
                  return (
                  <Fragment key={req.id}>
                    <tr style={{borderBottom:`1px solid ${C.border}`,background:isOpen?C.goldP:(i%2===0?C.white:'#FCFCFC')}}>
                      <td style={{padding:'12px 14px',color:C.gray,fontSize:11.5,whiteSpace:'nowrap'}}>{fmtFull(req.created_at)}</td>
                      <td style={{padding:'12px 14px',fontWeight:600,color:C.navy}}>{req.customer_name}</td>
                      <td style={{padding:'12px 14px'}}><a href={`tel:${req.phone}`} style={{color:C.info,textDecoration:'none'}}>{req.phone}</a></td>
                      <td style={{padding:'12px 14px',color:C.gray,maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{req.service_type}</td>
                      <td style={{padding:'12px 14px',color:C.gray,whiteSpace:'nowrap',fontSize:12}}>{req.preferred_date?`${fmtDate(req.preferred_date)}${req.preferred_time?` · ${req.preferred_time}`:''}`:'-'}</td>
                      <td style={{padding:'12px 14px'}}><StatusDropdown req={req}/></td>
                      <td style={{padding:'12px 14px'}}>
                        <button onClick={()=>{ if(isOpen){setSel(null);} else {setSel(req);setNote(req.notes||'');} }} style={{background:C.navy,color:C.white,border:'none',padding:'5px 12px',borderRadius:4,cursor:'pointer',fontSize:12,...jost()}}>
                          {isOpen?'Fermer ×':'Voir →'}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} style={{padding:0,background:C.grayL,borderBottom:`1px solid ${C.border}`}}>
                          <div style={{padding:'20px 28px'}}>
                            {selected.description && (
                              <div style={{marginBottom:18}}>
                                <div style={{fontSize:11,color:C.gray,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:6}}>Message patient</div>
                                <div style={{background:C.goldP,borderRadius:6,padding:'11px 15px',fontSize:14,color:C.navy,lineHeight:1.65,fontStyle:'italic'}}>"{selected.description}"</div>
                              </div>
                            )}
                            <div>
                              <div style={{fontSize:11,color:C.gray,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:8}}>Notes internes</div>
                              <textarea value={noteText} onChange={e=>setNote(e.target.value)} placeholder="Rappelé le... Confirmé le..." rows={3} style={{width:'100%',padding:'10px 13px',border:`1px solid ${C.border}`,borderRadius:6,fontSize:13,color:C.navy,background:C.white,outline:'none',resize:'vertical',boxSizing:'border-box',lineHeight:1.65,...jost()}}/>
                              <button onClick={()=>{updateRequest(selected.id,{notes:noteText});setSel({...selected,notes:noteText});}} style={{marginTop:8,background:C.navy,color:C.white,border:'none',padding:'8px 20px',borderRadius:4,cursor:'pointer',fontSize:13,...jost()}}>
                                Sauvegarder
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminPage({adminAuth,setAdminAuth,requests,updateRequest,nav}) {
  if (!adminAuth) return <AdminLogin onLogin={()=>setAdminAuth(true)}/>;
  return <CRMDashboard requests={requests} updateRequest={updateRequest} nav={nav} logout={()=>setAdminAuth(false)}/>;
}

// ─── APP ROOT ─────────────────────────────────────────
export default function App() {
  const [page, setPage]           = useState('home');
  const [adminAuth, setAdminAuth] = useState(false);
  const [requests, setRequests]   = useState([]);

  useEffect(()=>{
    const l = document.createElement('link');
    l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap';
    l.rel = 'stylesheet';
    document.head.appendChild(l);
  },[]);

  // Titre d'onglet + favicon dynamiques (CONFIG.faviconUrl vide = favicon par défaut du projet Vite/StackBlitz)
  useEffect(()=>{
    document.title = `${CONFIG.cabinetNameFull} — ${CONFIG.doctorName}`;
    if (CONFIG.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = CONFIG.faviconUrl;
    }
  },[]);

  // Initialisation EmailJS (une seule fois) — sans effet si publicKey vide (mode test non configuré)
  useEffect(()=>{
    if (CONFIG.emailjs.publicKey) { emailjs.init({publicKey: CONFIG.emailjs.publicKey}); }
  },[]);

  useEffect(()=>{
    try {
      const raw = localStorage.getItem('cdgp_v3');
      if (raw) { setRequests(JSON.parse(raw)); }
      else { setRequests(SAMPLE_DATA); localStorage.setItem('cdgp_v3',JSON.stringify(SAMPLE_DATA)); }
    } catch(e) { setRequests(SAMPLE_DATA); }
  },[]);

  const nav = p => {
    setPage(p);
    try { window.scrollTo({top:0,behavior:'instant'}); } catch(e) { try { window.scrollTo(0,0); } catch(e2){} }
  };

  const addRequest = fd => {
    const req = {...fd, id:Date.now().toString(), status:'Nouveau', notes:'', created_at:new Date().toISOString()};
    const up = [req,...requests];
    setRequests(up);
    try { localStorage.setItem('cdgp_v3',JSON.stringify(up)); } catch(e){}
    sendRdvNotification(req); // notifie le docteur par email (silencieux si EmailJS non configuré)
  };

  const updateRequest = (id,upd) => {
    const up = requests.map(r=>r.id===id?{...r,...upd}:r);
    setRequests(up);
    try { localStorage.setItem('cdgp_v3',JSON.stringify(up)); } catch(e){}
  };

  const props = {nav,requests,addRequest,updateRequest,adminAuth,setAdminAuth};

  return (
    <div style={{fontFamily:"'Jost','Helvetica Neue',sans-serif",color:C.navy,background:C.white,minHeight:'100vh'}}>
      <GlobalStyles/>
      {page!=='admin' && <Nav page={page} nav={nav}/>}
      {page==='home'     && <Home {...props}/>}
      {page==='services' && <ServicesPage {...props}/>}
      {page==='about'    && <AboutPage {...props}/>}
      {page==='contact'  && <ContactPage {...props}/>}
      {page==='rdv'      && <RDVPage addRequest={addRequest}/>}
      {page==='admin'    && <AdminPage {...props}/>}
      {page!=='admin'    && <Footer nav={nav}/>}
    </div>
  );
}
