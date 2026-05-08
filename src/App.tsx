import React, { useState } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Palette, 
  Layout, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Sun,
  Type,
  Mic,
  Image as ImageIcon,
  Share2,
  Download,
  FileText,
  Volume2,
  Users,
  Sparkles,
  Loader
} from 'lucide-react';

const BRAND_COLORS = [
  { name: 'أخضر ريفي داكن', en: 'Deep Rural Green', hex: '#1E4D2B', text: 'white', category: 'Primary' },
  { name: 'أخضر حيوي', en: 'Nature Green', hex: '#4CAF50', text: 'white', category: 'Secondary' },
  { name: 'أخضر ليموني', en: 'Light Green Accent', hex: '#A3C63A', text: 'black', category: 'Accent' },
  { name: 'بني ترابي', en: 'Earthy Brown', hex: '#8A6E5D', text: 'white', category: 'Secondary' },
  { name: 'أصفر ذهبي', en: 'Golden Harvest', hex: '#E4A201', text: 'black', category: 'Accent' },
  { name: 'برتقالي دافئ', en: 'Warm Orange', hex: '#D6613F', text: 'white', category: 'Accent' },
  { name: 'أبيض عاجي', en: 'Ivory White', hex: '#F8F4EA', text: 'black', category: 'Neutral' },
  { name: 'رمادي داكن كحلي', en: 'Navy-Tinged Dark Gray', hex: '#3F4755', text: 'white', category: 'Neutral' },
];

const MODE_DATA = [
  { 
    id: 'PRIMARY', 
    name: 'النسخة الرسمية', 
    sub: 'Primary Brand', 
    bg: 'bg-white', 
    colors: ['#1E4D2B', '#A3C63A'],
    direction: {
      type: 'منشور تعريف بالهوية / غلاف بروشور',
      visual: 'توازن كلاسيكي، كتل لونية صلبة، هوامش واسعة للتنفس البصري.',
      typography: 'خط الإسكندرية (Alexandria) بأوزان ثقيلة للعناوين ووسط للنصوص.',
      graphic: 'أيقونات خطية بسيطة، استخدام الشعار كعنصر توازن أساسي.',
      background: 'أبيض عاجي مسطح مع ظل ناعم للعناصر العائمة.',
      tone: 'احترافي، مؤسسي، موثوق، مرتبط بالجذور.',
      headline: 'علّان: حيث تنمو الأصالة..',
      tagline: 'Bridging Heritage and Horizon.'
    }
  },
  { 
    id: 'NATURE', 
    name: 'الطبيعة الديناميكية', 
    sub: 'Nature Gradient', 
    bg: 'bg-gradient-to-br from-[#1E4D2B] via-[#4CAF50] to-[#E4A201]', 
    colors: ['#1E4D2B', '#E4A201'],
    direction: {
      type: 'حملات بيئية / منشورات زراعية',
      visual: 'تدرجات لونية حيوية، حركة عضوية، تباين عالي بين الأخضر والذهبي.',
      typography: 'خط عصري بلمسة إنسانية، تداخل النصوص مع عناصر الطبيعة.',
      graphic: 'أشكال ورقية، خطوط انسيابية تحاكي تضاريس الأرض.',
      background: 'تدرج لوني سينمائي مع ملمس حبيبي خفيف (Grain).',
      tone: 'حيوي، متجدد، شغوف، طبيعي.',
      headline: 'الأرض تتحدث.. هل تسمع؟',
      tagline: 'The Voice of the Soil.'
    }
  },
  { 
    id: 'EARTH', 
    name: 'الأرض والتراث', 
    sub: 'Earth Mode', 
    bg: 'bg-[#EADDCB]', 
    colors: ['#8A6E5D', '#EADDCB'],
    direction: {
      type: 'بطاقات تراثية / محتوى تاريخي',
      visual: 'ألوان ترابية دافئة، محاكاة لملمس الطين والحجر، بساطة ريفية.',
      typography: 'تنسيق تيبوغرافي يحاكي المخطوطات القديمة بأسلوب عصري.',
      graphic: 'نقوش يمنية تقليدية، استخدام الظلال القوية لخلق عمق مكاني.',
      background: 'ملمس ورقي أو طيني (Textured Background).',
      tone: 'دافئ، حنين، أصيل، تاريخي.',
      headline: 'من طينها.. بُنيت حكايتنا.',
      tagline: 'Built from the Dust of Time.'
    }
  },
  { 
    id: 'HARVEST', 
    name: 'نسخة الحصاد', 
    sub: 'Harvest Mode', 
    bg: 'bg-[#E4A201]', 
    colors: ['#E4A201', '#FFFFFF'],
    direction: {
      type: 'منشورات الاحتفال / نتائج الحملات',
      visual: 'استخدام جريء للون الأصفر الذهبي، تباين حاد مع الأبيض.',
      typography: 'عناوين ضخمة ومركزية للتعبير عن الوفرة والنجاح.',
      graphic: 'أشكال هندسية مستوحاة من سنابل القمح وبراعم الثمار.',
      background: 'لون صلب مشع يرمز للشمس والحياة.',
      tone: 'متفائل، احتفالي، ناجح، مشرق.',
      headline: 'آن أوان القطاف..',
      tagline: 'The Season of abundance.'
    }
  },
  { 
    id: 'MONO_DARK', 
    name: 'أحادي - أسود', 
    sub: 'Mono Dark', 
    bg: 'bg-white', 
    colors: ['#000000'],
    direction: {
      type: 'بوسترات فنية / بيان رسمي',
      visual: 'تقليلية متطرفة (Minimalism)، اعتماد كلي على الظلال والضوء.',
      typography: 'خطوط نحيفة وأنيقة مع مسافات تتبع واسعة.',
      graphic: 'خطوط رفيعة، أشكال مجردة سوداء على خلفية بيضاء.',
      background: 'أبيض نقي أو رمادي فاتح جداً.',
      tone: 'فخم، غامض، فني، جاد.',
      headline: 'جوهر الأشياء..',
      tagline: 'The Essence of Being.'
    }
  },
  { 
    id: 'DARK', 
    name: 'النسخة الرقمية الليلية', 
    sub: 'Dark Mode', 
    bg: 'bg-[#3F4755]', 
    colors: ['#3F4755', '#F8F4EA'],
    direction: {
      type: 'محتوى تقني / تطبيق علّان',
      visual: 'واجهة ليلية مريحة، عناصر مضيئة بالأخضر الليموني لتوجيه الانتباه.',
      typography: 'تنسيق هيراركي (تراتبي) واضح يناسب القراءة الرقمية المطولة.',
      graphic: 'عناصر مضيئة (Glow Effects)، أيقونات حديثة بلمسة تقنية.',
      background: 'رمادي داكن كحلي عميق.',
      tone: 'حديث، تقني، ذكي، مستقبلي.',
      headline: 'علّان في نسخته الرقمية..',
      tagline: 'Heritage in Dark Mode.'
    }
  },
  { 
    id: 'PODCAST', 
    name: 'النسخة الإعلامية', 
    sub: 'Podcast Mode', 
    bg: 'bg-[#D6613F]', 
    colors: ['#D6613F', '#FFFFFF'],
    direction: {
      type: 'أغلفة حلقات البودكاست / بطاقات اقتباس صوتي',
      visual: 'ألوان دافئة تحاكي استوديوهات التسجيل، عناصر بصرية مرتبطة بالصوت.',
      typography: 'خطوط عريضة (Bold) وسهلة القراءة من بعيد.',
      graphic: 'موجات صوتية، أشكال دائرية تحاكي الميكروفونات التقليدية.',
      background: 'برتقالي دافئ مع تدرج ناعم نحو البني.',
      tone: 'حميمي، قصصي، مسموع، إعلامي.',
      headline: 'صوت الأرض.. في أذنيك.',
      tagline: 'The Sound of the Soil.'
    }
  },
  { 
    id: 'CREATIVE', 
    name: 'النسخة المبتكرة', 
    sub: 'Creative Mode', 
    bg: 'bg-gray-100', 
    colors: ['#1E4D2B', '#A3C63A', '#E4A201'],
    direction: {
      type: 'تجارب فنية / منشورات تجريبية',
      visual: 'حرية بصرية كاملة، تداخل الأنماط والأنواع، كولاج رقمي.',
      typography: 'تجارب تيبوغرافية، دمج الخطوط، أحجام غير متوقعة.',
      graphic: 'أشكال عشوائية، بقع لونية، عناصر تراثية بلمسة حداثة.',
      background: 'خلفيات مركبة متعددة الطبقات.',
      tone: 'مفاجئ، تجريبي، مبدع، غير مقيد.',
      headline: 'حيث يزهر الخيال..',
      tagline: 'Where Imagination Blooms.'
    }
  },
];

const PODCAST_FORMATS = [
  { id: 'NARRATIVE', name: 'سرد قصصي', en: 'Narrative Storytelling' },
  { id: 'INTERVIEW', name: 'حوار', en: 'Interview Format' },
  { id: 'DOCUMENTARY', name: 'وثائقي', en: 'Documentary Style' },
  { id: 'EDUCATIONAL', name: 'تعليمي', en: 'Educational Episode' },
  { id: 'CULTURAL', name: 'تراثي', en: 'Cultural & Heritage' },
  { id: 'CAMPAIGN', name: 'توعوي', en: 'Awareness Campaign' },
  { id: 'EXPERIMENTAL', name: 'تجريبي', en: 'Experimental Audio' },
];

const PODCAST_TONES = [
  { id: 'DOCUMENTARY_SERIOUS', name: 'وثائقي جاد', en: 'Documentary Serious' },
  { id: 'EMOTIONAL', name: 'قصصي عاطفي', en: 'Emotional Storytelling' },
  { id: 'YOUTH_CASUAL', name: 'شبابي عفوي', en: 'Youth Casual' },
  { id: 'ACADEMIC', name: 'أكاديمي تحليلي', en: 'Academic Analytical' },
  { id: 'CULTURAL_TRADITIONAL', name: 'تراثي تقليدي', en: 'Cultural Traditional' },
  { id: 'INVESTIGATIVE', name: 'تحقيقي استقصائي', en: 'Investigative Journalistic' },
];

const PODCAST_CHARACTERS = [
  { id: 'HOST', name: 'المقدم (Host)', icon: Users },
  { id: 'NARRATOR', name: 'السارد (Narrator)', icon: Volume2 },
  { id: 'GUEST', name: 'الضيف (Guest)', icon: Users },
  { id: 'COMMUNITY', name: 'صوت من المجتمع', icon: Volume2 },
];

const FadoolLogo = ({ mode = 'PRIMARY', className = "", showLabel = false }: { mode?: string, className?: string, showLabel?: boolean }) => {
  const isDark = ['DARK', 'PODCAST', 'HARVEST', 'NATURE'].includes(mode);
  
  const colors = {
    bubble: isDark ? '#FFFFFF' : '#3F4755',
    textAr: '#E4A201',
    textEn: '#3F4755',
    label: isDark ? 'text-white/40' : 'text-brand-gray-navy/40'
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
           <path d="M10,20 L80,5 L95,65 L78,65 L80,95 L65,65 L10,65 Z" fill={colors.bubble} />
        </svg>
        <div className="flex flex-col items-start leading-none text-right" dir="rtl">
           <div className="text-[10px] font-black text-[#E4A201]" style={{ fontFamily: '"Alexandria", sans-serif' }}>فضول بودكاست</div>
           <div className="text-[8px] font-black tracking-tight text-[#3F4755]" style={{ fontFamily: '"Inter", sans-serif' }}>FADOOL PODCAST</div>
        </div>
      </div>
      {showLabel && (
        <span className={`text-[7px] font-bold uppercase tracking-widest ${colors.label}`}>
          Powered & Produced by Fadool Podcast
        </span>
      )}
    </div>
  );
};

const AllanLogo = ({ mode = 'PRIMARY', className = "" }: { mode?: string, className?: string }) => {
  const getColors = () => {
    switch (mode) {
      case 'NATURE': return { dark: '#1E4D2B', med: '#4CAF50', light: '#E4A201', text: '#1E4D2B' };
      case 'EARTH': return { dark: '#5D4037', med: '#8A6E5D', light: '#EADDCB', text: '#5D4037' };
      case 'HARVEST': return { dark: 'white', med: 'white', light: 'white', text: 'white' };
      case 'MONO_DARK': return { dark: 'black', med: 'black', light: 'black', text: 'black' };
      case 'MONO_LIGHT': return { dark: 'white', med: 'white', light: 'white', text: 'white' };
      case 'DARK': return { dark: '#F8F4EA', med: '#A3C63A', light: '#A3C63A', text: '#F8F4EA' };
      case 'PODCAST': return { dark: 'white', med: 'white', light: 'white', text: 'white' };
      case 'CREATIVE': return { dark: '#1E4D2B', med: '#E4A201', light: '#A3C63A', text: '#1E4D2B' };
      default: return { dark: '#1E4D2B', med: '#A3C63A', light: '#A3C63A', text: '#1E4D2B' };
    }
  };

  const { dark, med, light, text } = getColors();

  return (
    <div className={`flex items-center gap-3 ${className}`} dir="rtl">
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold leading-none mb-1" style={{ color: dark, fontFamily: '"Alexandria", sans-serif' }}>علان</div>
        <div className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: text, fontFamily: '"Inter", sans-serif' }}>ALLAN</div>
      </div>
      <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
        {/* Head */}
        <circle cx="58" cy="18" r="8" fill={light} />
        
        {/* Upper Leaf (Light/Med) */}
        <path 
          d="M58 28C58 28 45 45 45 55C45 65 55 70 70 65C60 65 52 50 78 35C78 35 65 25 58 28Z" 
          fill={med} 
        />
        
        {/* Lower Leaf (Dark) */}
        <path 
          d="M35 50C35 50 25 75 50 85C75 95 85 70 85 70C85 70 65 80 40 68C30 60 35 50 35 50Z" 
          fill={dark} 
        />
      </svg>
    </div>
  );
};

const CONTENT_LAB = [
  { 
    id: 'SOCIAL', 
    name: 'سوشيال ميديا', 
    icon: ImageIcon,
    types: ['منشور مربع', 'كيروزيل', 'ستوري', 'غلاف ريلز'],
    goal: 'ترويجي / تفاعلي'
  },
  { 
    id: 'PODCAST', 
    name: 'بودكاست وصوت', 
    icon: Mic,
    types: ['غلاف حلقة', 'غلاف برنامج', 'أوديوجرام', 'بطاقة اقتباس'],
    goal: 'سردي / ترويجي'
  },
  { 
    id: 'CULTURAL', 
    name: 'ثقافة وتراث', 
    icon: Layout,
    types: ['بوست قصصي', 'بطاقة تراثية', 'تايملاين', 'خريطة ثقافية'],
    goal: 'سردي / تعليمي'
  },
  { 
    id: 'CAMPAIGN', 
    name: 'حملات وإعلانات', 
    icon: Share2,
    types: ['بوستر', 'إعلان فعاليات', 'بوست CTA', 'عد تنازلي'],
    goal: 'ترويجي / توعوي'
  },
  { 
    id: 'EDUCATIONAL', 
    name: 'محتوى تعليمي', 
    icon: Type,
    types: ['إنفوجرافيك', 'خطوات عمل', 'شرح مفاهيم', 'مقارنة'],
    goal: 'تعليمي / توعوي'
  },
  { 
    id: 'BRANDING', 
    name: 'هوية البراند', 
    icon: Palette,
    types: ['عن علان', 'قيمنا', 'خلف الكواليس', 'فريق العمل'],
    goal: 'سردي / تعريفي'
  },
  { 
    id: 'CREATIVE', 
    name: 'إبداعي وتجريبي', 
    icon: Sun,
    types: ['بوستر تيبوغرافي', 'اقتباس بصري', 'تكوين تجريدي', 'كولاج'],
    goal: 'إبداعي / سردي'
  },
  { 
    id: 'INTERACTIVE', 
    name: 'تفاعلي', 
    icon: Share2,
    types: ['سؤال / Poll', 'كويز', 'أكمل الفراغ', 'تفاعل يومي'],
    goal: 'تفاعلي / Engagement'
  }
];

const ContentPreview = ({ mode, type, category }: { mode: string, type: string, category: string }) => {
  const data = MODE_DATA.find(m => m.id === mode);
  const cat = CONTENT_LAB.find(c => c.id === category);
  
  const isDark = ['HARVEST', 'PODCAST', 'DARK', 'NATURE'].includes(mode);

  return (
    <div className={`w-full aspect-[4/5] ${data?.bg} p-8 lg:p-10 flex flex-col justify-between shadow-2xl rounded-[2.5rem] relative overflow-hidden group border border-black/5`}>
      {/* 5. Micro Elements - Border Accents */}
      <div className={`absolute top-0 left-0 w-full h-1 transition-all ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />

      {/* 1. Logo Placement (Top Right for Social) */}
      <div className="flex justify-between items-start relative z-10">
        <AllanLogo mode={mode} className="scale-[0.4] origin-top-right -mt-4 -mr-4" />
        
        {/* Micro Element: Green Accent Dot */}
        <div className="w-2 h-2 rounded-full bg-brand-green-accent animate-pulse shadow-[0_0_10px_#A3C63A]" />
      </div>

      {/* 4. Grid System - Main Column */}
      <div dir="rtl" className="space-y-6 relative z-10 mt-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`h-[2px] w-12 ${isDark ? 'bg-brand-green-accent' : 'bg-brand-green-deep'}`} 
        />
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          key={`${mode}-${type}`}
          className={`text-5xl lg:text-5xl font-black leading-[1.1] tracking-tighter ${isDark ? 'text-white' : 'text-brand-green-deep'}`}
        >
          {type === 'بوست قصصي' ? 'حكايا لا تموت..' : 'هوية تنمو من قلب الأرض'}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.2 }}
          className={`text-lg lg:text-xl leading-relaxed max-w-lg ${isDark ? 'text-white/80' : 'text-brand-gray-navy/80'}`}
        >
          نصل الماضي بالمستقبل عبر حكايا الأرض والإنسان، بمزيج من الأصالة والحداثة الرقمية.
        </motion.p>
      </div>

      {/* 2. Social Handle (@AllanYemen) & Production Mark */}
      <div className="flex items-end justify-between relative z-10 pt-4 border-t border-black/5">
        <div className="flex flex-col gap-2">
          <span className={`text-[10px] font-black tracking-widest ${isDark ? 'text-white/40' : 'text-brand-gray-navy/30'}`}>@AllanYemen</span>
          <FadoolLogo mode={mode} className="scale-75 origin-bottom-right" showLabel />
        </div>
        <div className={`text-[8px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/20' : 'text-black/10'}`}>
          {mode} MODE // 2026
        </div>
      </div>
    </div>
  );
};

const BackgroundArt = ({ mode, content, intensity, grain, atmosphere }: { mode: string, content: string, intensity: number, grain: number, atmosphere: string }) => {
  const data = MODE_DATA.find(m => m.id === mode);
  const color1 = data?.colors[0] || '#1E4D2B';
  const color2 = data?.colors[1] || color1;
  const isDark = ['DARK', 'PODCAST', 'HARVEST', 'NATURE'].includes(mode);

  return (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center transition-colors duration-1000 ${data?.bg}`}>
      {/* Abstract Shapes based on Intensity */}
      <div 
        className="absolute w-[150%] h-[150%] opacity-30 blur-[100px] transition-transform duration-[3s]"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${color1}, transparent), radial-gradient(circle at 70% 70%, ${color2}, transparent)`,
          transform: `scale(${1 + intensity/200}) rotate(${intensity/10}deg)`
        }} 
      />

      {/* Pattern Overlay based on Content Mode */}
      {content === 'CULTURAL' && (
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      )}
      {content === 'PODCAST' && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-1 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ height: ['10%', `${20 + Math.random() * 80}%`, '10%'] }}
               transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
               className="w-2 bg-white rounded-t-full"
             />
          ))}
        </div>
      )}
      {content === 'CREATIVE' && (
        <div className="absolute inset-0 opacity-[0.05]" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 100px, ${color1} 100px, ${color1} 101px)` }} />
      )}

      {/* Atmosphere Lighting */}
      {atmosphere === 'CINEMATIC' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent blend-multiply" />
      )}
      {atmosphere === 'ARTISTIC' && (
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-brand-gold-harvest/20 to-transparent" />
      )}

      {/* Grain Texture */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ 
          opacity: grain / 100,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 Fortnight with fine noise %3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} 
      />

      {/* Central Focal Point (Subtle) */}
      <div className={`w-64 h-64 border-2 rounded-full absolute transition-opacity duration-1000 ${isDark ? 'border-white/5' : 'border-black/5'} scale-150`} />
      <div className={`w-96 h-96 border rounded-full absolute transition-opacity duration-1000 ${isDark ? 'border-white/10' : 'border-black/10'} scale-125 translate-x-1/4`} />
    </div>
  );
};

const ColorCard = ({ color }: any) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-brand-gray-navy/5 group h-full p-3"
    >
      <div 
        className="h-48 w-full transition-transform duration-500 group-hover:scale-105 rounded-[2rem] shadow-inner flex items-end p-6" 
        style={{ backgroundColor: color.hex }}
      >
         <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20`}>
            {color.category}
          </span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div dir="rtl">
            <h3 className="font-black text-2xl text-brand-gray-navy">{color.name}</h3>
            <p className="text-sm text-brand-gray-navy/40 font-bold uppercase tracking-tight">{color.en}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-50">
          <code className="text-base font-mono font-black text-brand-gray-navy/80">{color.hex}</code>
          <button 
            onClick={copyToClipboard}
            className="p-3 bg-gray-50 hover:bg-brand-green-deep hover:text-white rounded-2xl transition-all shadow-sm"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('STUDIO');
  const [activeMode, setActiveMode] = useState('PRIMARY');
  const [activeCategory, setActiveCategory] = useState('SOCIAL');
  const [activeType, setActiveType] = useState('منشور مربع');

  // Background Generator State
  const [bgContentMode, setBgContentMode] = useState('SOCIAL');
  const [bgIntensity, setBgIntensity] = useState(50);
  const [bgGrain, setBgGrain] = useState(20);
  const [bgAtmosphere, setBgAtmosphere] = useState('CINEMATIC');

  // Script Engine State
  const [scriptFormat, setScriptFormat] = useState('NARRATIVE');
  const [scriptTone, setScriptTone] = useState('EMOTIONAL');
  const [scriptTargetMode, setScriptTargetMode] = useState('PODCAST');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyScript = async () => {
    if (!generatedScript) return;
    try {
      await navigator.clipboard.writeText(generatedScript);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShareScript = async () => {
    if (!generatedScript) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'اسكربت مشروع علّان - ' + scriptFormat,
          text: generatedScript,
        });
      } else {
        handleCopyScript();
        alert('تم نسخ الاسكربت إلى الحافظة (لا يدعم المتصفح المشاركة المباشرة)');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Failed to share:', err);
      }
    }
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setScriptError(null);
    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: PODCAST_FORMATS.find(f => f.id === scriptFormat)?.name || scriptFormat,
          tone: PODCAST_TONES.find(t => t.id === scriptTone)?.name || scriptTone,
          targetMode: CONTENT_LAB.find(c => c.id === scriptTargetMode)?.name || scriptTargetMode
        })
      });
      
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to generate script. API Error.');
      
      setGeneratedScript(data.script);
    } catch (err) {
      setScriptError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCategory = CONTENT_LAB.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-brand-white-ivory text-brand-gray-navy selection:bg-brand-gold-harvest/30 font-sans pb-20">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-brand-gray-navy/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <AllanLogo mode="PRIMARY" className="scale-75 origin-right" />
            <div className="h-8 w-[1px] bg-gray-200" />
            <FadoolLogo mode="PRIMARY" className="scale-[0.6] origin-left" showLabel />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('STUDIO')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'STUDIO' ? 'bg-brand-green-deep text-white shadow-lg' : 'hover:bg-gray-100'}`}
            >
              استوديو التصميم
            </button>
            <button 
              onClick={() => setActiveTab('BACKGROUND')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'BACKGROUND' ? 'bg-brand-green-deep text-white shadow-lg' : 'hover:bg-gray-100'}`}
            >
              مولّد الخلفيات
            </button>
            <button 
              onClick={() => setActiveTab('SCRIPT')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'SCRIPT' ? 'bg-brand-green-deep text-white shadow-lg' : 'hover:bg-gray-100'}`}
            >
              اسكربت البودكاست
            </button>
            <button 
              onClick={() => setActiveTab('PALETTE')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'PALETTE' ? 'bg-brand-green-deep text-white shadow-lg' : 'hover:bg-gray-100'}`}
            >
              لوحة الألوان
            </button>
          </div>
        </div>
      </nav>

      {activeTab === 'STUDIO' ? (
        <main className="max-w-7xl mx-auto px-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-16" dir="rtl">
            <h1 className="text-6xl font-black tracking-tighter text-brand-green-deep mb-4">Content Lab.</h1>
            <p className="text-2xl text-brand-gray-navy/60 max-w-3xl leading-relaxed">
              استكشف تطبيقات الهوية البصرية عبر 8 أنماط متلونة، مصممة لتحاكي الأرض، الحصاد، والمحتوى الرقمي الحديث.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 space-y-6">
              <div dir="rtl">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">فئات المحتوى</h3>
                <div className="grid grid-cols-1 gap-2">
                  {CONTENT_LAB.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setActiveType(cat.types[0]);
                        }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${activeCategory === cat.id ? 'bg-brand-green-deep text-white shadow-xl shadow-brand-green-deep/20 border-transparent' : 'bg-white border-brand-gray-navy/5 hover:border-brand-green-deep/30'}`}
                      >
                        <Icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-brand-green-accent' : 'text-brand-green-deep'}`} />
                        <span className="font-bold text-sm text-right flex-1">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div dir="rtl">
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">أنماط الهوية</h3>
                <div className="grid grid-cols-2 gap-3">
                  {MODE_DATA.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={`flex flex-col gap-2 p-3 rounded-2xl border-2 transition-all group ${activeMode === mode.id ? 'border-brand-green-deep bg-white shadow-xl' : 'border-transparent bg-white/50 hover:bg-white'}`}
                    >
                      <div className={`w-full aspect-video rounded-xl ${mode.bg} shadow-inner shrink-0 transition-transform`} />
                      <div className="text-[10px] font-black uppercase tracking-tighter opacity-50 text-center">{mode.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Generator */}
            <div className="lg:col-span-9 space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-1 rounded-[3rem] shadow-2xl border border-black/5">
                   <ContentPreview mode={activeMode} type={activeType} category={activeCategory} />
                </div>

                <div className="flex flex-col gap-6">
                  {/* Design Direction Specs */}
                  <div className="bg-brand-gray-navy rounded-[2.5rem] p-10 text-white flex-1" dir="rtl">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                      <h3 className="text-xl font-black">Micro Branding Config</h3>
                      <div className="px-3 py-1 rounded bg-white/10 text-[10px] font-black tracking-widest text-brand-green-accent">SYSTEM ACTIVE</div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-white/30 text-[9px] font-black uppercase mb-1">Logo Placement</div>
                          <div className="text-xs font-bold">Top-Right (Secured)</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-[9px] font-black uppercase mb-1">Handle Placement</div>
                          <div className="text-xs font-bold">@AllanYemen (Bottom)</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-[9px] font-black uppercase mb-1">Watermark Type</div>
                          <div className="text-xs font-bold text-white/20 italic">None (Disabled)</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-[9px] font-black uppercase mb-1">Grid Structure</div>
                          <div className="text-xs font-bold">Structured Margins</div>
                        </div>
                        <div>
                          <div className="text-white/30 text-[9px] font-black uppercase mb-1">Executing Entity</div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-4 bg-brand-green-accent rounded-sm flex items-center justify-center">
                               <FadoolLogo mode="DARK" className="scale-[0.25]" />
                            </div>
                            <div className="text-xs font-bold text-brand-green-accent">Fadool Podcast (Execution Authority)</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <div className="text-white/40 text-[10px] font-black uppercase mb-2">Graphic Style</div>
                        <div className="flex flex-wrap gap-2 text-[9px] font-bold">
                          <span className="px-2 py-1 bg-white/10 rounded">Green Accent Dot</span>
                          <span className="px-2 py-1 bg-white/10 rounded">Soft Hierarchy</span>
                          <span className="px-2 py-1 bg-white/10 rounded">Minimal Content</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-12 py-5 bg-brand-green-accent text-brand-green-deep rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                      تصدير المواصفات الفنية
                    </button>
                  </div>

                  {/* Sub-types selection */}
                  <div className="bg-white p-8 rounded-[2rem] border border-black/5" dir="rtl">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/30 mb-4">خيارات النوع المختارة</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentCategory?.types.map(t => (
                        <button 
                          key={t}
                          onClick={() => setActiveType(t)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeType === t ? 'bg-brand-gold-harvest text-black' : 'bg-gray-50 hover:bg-gray-100 text-brand-gray-navy/60'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : activeTab === 'SCRIPT' ? (
        <main className="max-w-7xl mx-auto px-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="mb-16" dir="rtl">
            <h1 className="text-6xl font-black tracking-tighter text-brand-green-deep mb-4 uppercase">Script Engine.</h1>
            <p className="text-2xl text-brand-gray-navy/60 max-w-3xl leading-relaxed">
              محرك إبداعي متخصص في هندسة المحتوى الصوتي والسرد القصصي، مصمم لإنتاج اسكربتات بودكاست احترافية تلامس الروح.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Script Configuration Panel */}
            <div className="lg:col-span-4 space-y-8" dir="rtl">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 space-y-8 text-right">
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6 flex items-center gap-2">
                     <FileText className="w-4 h-4" /> قالب البودكاست
                   </h3>
                   <div className="grid grid-cols-1 gap-2">
                      {PODCAST_FORMATS.map(f => (
                        <button 
                          key={f.id}
                          onClick={() => setScriptFormat(f.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${scriptFormat === f.id ? 'bg-brand-green-deep text-white border-transparent shadow-lg' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                        >
                          <span className="font-bold">{f.name}</span>
                          <span className={`text-[10px] font-black uppercase opacity-40 ml-2`}>{f.en}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6 flex items-center gap-2">
                     <Sparkles className="w-4 h-4" /> نبرة الصوت (Tone)
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {PODCAST_TONES.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => setScriptTone(t.id)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${scriptTone === t.id ? 'bg-brand-gold-harvest text-black' : 'bg-gray-100 text-brand-gray-navy/40 hover:bg-gray-200'}`}
                        >
                          {t.name}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">سياق علّان (Content Mode)</h3>
                   <div className="grid grid-cols-2 gap-2">
                      {CONTENT_LAB.slice(0, 6).map(c => (
                        <button 
                          key={c.id}
                          onClick={() => setScriptTargetMode(c.id)}
                          className={`p-3 rounded-xl border text-[10px] font-black uppercase transition-all ${scriptTargetMode === c.id ? 'bg-brand-green-accent text-brand-green-deep border-transparent' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                        >
                          {c.id}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <div className="bg-brand-gray-navy p-8 rounded-[2.5rem] text-white space-y-6">
                 <button 
                  onClick={handleGenerateScript}
                  disabled={isGenerating}
                  className="w-full py-5 bg-brand-green-accent text-brand-green-deep rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? 'جاري التوليد بواسطة Gemini...' : 'توليد اسكربت كامل'} {!isGenerating && <Sparkles className="w-4 h-4" />}
                 </button>
                 {scriptError && (
                   <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-500/20 text-right" dir="rtl">
                     {scriptError}
                   </div>
                 )}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="text-[10px] opacity-40 uppercase mb-1">Duration Est.</div>
                       <div className="text-xs font-bold">~12:45 min</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <div className="text-[10px] opacity-40 uppercase mb-1">Complexity</div>
                       <div className="text-xs font-bold">High Narrative</div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Script Display Area */}
            <div className="lg:col-span-8">
               <div className="bg-white rounded-[3.5rem] shadow-2xl border border-black/5 overflow-hidden flex flex-col min-h-[800px]">
                  {/* Script Header */}
                  <div className="p-10 border-b border-gray-100 bg-gray-50/50" dir="rtl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-2">
                        <div className="px-4 py-1.5 bg-brand-green-deep text-white rounded-full text-[10px] font-black uppercase tracking-widest text-center">
                          Draft: v1.02 // Production Ready
                        </div>
                        <FadoolLogo mode="PRIMARY" className="scale-50 origin-right" showLabel />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleCopyScript}
                          disabled={!generatedScript}
                          className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-black/5 disabled:opacity-30 flex items-center justify-center gap-2"
                          title="نسخ الاسكربت"
                        >
                          {copySuccess ? <CheckCircle2 className="w-4 h-4 text-brand-green-nature" /> : <Copy className="w-4 h-4 opacity-40" />}
                        </button>
                        <button 
                          onClick={handleShareScript}
                          disabled={!generatedScript}
                          className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-black/5 disabled:opacity-30"
                          title="مشاركة الاسكربت"
                        >
                          <Share2 className="w-4 h-4 opacity-40" />
                        </button>
                      </div>
                    </div>
                    <h2 className="text-4xl font-black text-brand-green-deep mb-2 leading-tight">
                      {scriptFormat === 'CULTURAL' ? 'تراتيل الطين: حكاية السد القديم' : 'أرض لا تنام: رحلة عبر مواسم علّان'}
                    </h2>
                    <p className="text-brand-gray-navy/40 font-bold text-sm">Target Audience: {scriptTargetMode} enthusiasts & Yemeni Youth</p>
                  </div>

                  {/* Script Content */}
                  <div className="flex-1 p-10 overflow-y-auto max-h-[1200px]" dir="rtl">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center h-full text-brand-gray-navy/40 gap-4 mt-20">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                          <Loader className="w-12 h-12" />
                        </motion.div>
                        <p className="font-bold tracking-widest text-sm">يقوم Gemini بصياغة المعنى...</p>
                      </div>
                    ) : generatedScript ? (
                      <div className="markdown-body" dir="rtl">
                        <Markdown>{generatedScript}</Markdown>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {/* Hook & Intro */}
                        <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-green-accent" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">الافتتاحية (Intro / Hook)</h4>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-brand-green-deep italic text-brand-gray-navy/80 leading-relaxed italic">
                          (صوت هبوب رياح خفيفة.. ثم صوت ضربات معول على أرض صلبة)
                          <br />
                          <br />
                          <b>المقدم:</b> "يقولون أن المطر لا يسقي الأرض فقط، بل يوقظ الحكايا المدفونة في طينها.. هنا في علّان، كل حبة تراب هي ذاكرة."
                        </div>
                      </section>

                      {/* Characters / Script */}
                      <section className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-green-accent" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40">السرد الحواري (Narrative)</h4>
                        </div>
                        
                        <div className="space-y-8">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-green-deep flex items-center justify-center shrink-0">
                               <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                               <div className="text-[10px] font-black uppercase text-brand-green-deep mb-1">Host (مقدم البرنامج)</div>
                               <p className="text-lg leading-relaxed text-brand-gray-navy">
                                  "اليوم نأخذكم إلى قرية لم يغيرها الوقت، بل علّمها كيف تصمد. حكايتنا اليوم عن 'بذور الصمود' التي تناقلتها الأجيال سراً."
                               </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-gold-harvest flex items-center justify-center shrink-0">
                               <Volume2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                               <div className="text-[10px] font-black uppercase text-brand-gold-harvest mb-1">Sound Design Note</div>
                               <p className="p-4 bg-brand-gold-harvest/5 rounded-xl border border-brand-gold-harvest/10 text-brand-gray-navy/60 italic text-sm">
                                  تلاشي تدريجي للموسيقى الريفية (مزمار يمني خفيف) مع دخول صوت خطوات حذرة على الحصى.
                               </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-gray-navy flex items-center justify-center shrink-0">
                               <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                               <div className="text-[10px] font-black uppercase text-brand-gray-navy mb-1">Old Farmer (صوت المجتمع)</div>
                               <p className="text-lg leading-relaxed text-brand-gray-navy italic">
                                  "والله يا ولدي، هذه الأرض ما جفت يوماً.. كنا نخبئ البذور بين صخور الجبال حين تشتد الأزمات، لأن الأرض لا تطرد أبناءها الأوفياء."
                               </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Script Footer */}
                      <section className="pt-10 border-t border-gray-100 flex flex-wrap gap-4">
                         <div className="px-6 py-4 bg-brand-gray-navy rounded-3xl text-white flex-1 min-w-[250px]">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Voice Direction</h5>
                            <ul className="text-xs space-y-2 opacity-80 list-disc list-inside">
                               <li>تحدث بهدوء مع وقفات تأملية طويلة</li>
                               <li>التركيز العاطفي على كلمة "الأرض" في كل مرة</li>
                               <li>تحول في النبرة من الاستفهامية إلى الحتمية الجادة</li>
                            </ul>
                         </div>
                         <div className="px-6 py-4 bg-brand-green-deep rounded-3xl text-white flex-1 min-w-[250px]">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Production Themes</h5>
                            <div className="flex flex-wrap gap-2">
                               <span className="px-2 py-1 bg-white/10 rounded text-[9px] font-bold">Resilience</span>
                               <span className="px-2 py-1 bg-white/10 rounded text-[9px] font-bold">Generational Wisdom</span>
                               <span className="px-2 py-1 bg-white/10 rounded text-[9px] font-bold">Soil Memory</span>
                            </div>
                         </div>
                      </section>
                    </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </main>
      ) : activeTab === 'BACKGROUND' ? (
        <main className="max-w-7xl mx-auto px-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <header className="mb-16" dir="rtl">
            <h1 className="text-6xl font-black tracking-tighter text-brand-green-deep mb-4 uppercase">BG Generator.</h1>
            <p className="text-2xl text-brand-gray-navy/60 max-w-3xl leading-relaxed">
              نظام ذكاء بصري لتوليد خلفيات إبداعية مستوحاة من هوية علّان، مصممة بدقة لتناسب مختلف سياقات المحتوى الرقمي.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Background Control Panel */}
            <div className="lg:col-span-4 space-y-8" dir="rtl">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 space-y-8">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">وضع المحتوى المستهدف</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTENT_LAB.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setBgContentMode(cat.id)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${bgContentMode === cat.id ? 'bg-brand-green-deep text-white border-transparent' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">نمط الألوان (Color Mood)</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {MODE_DATA.map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setActiveMode(mode.id)}
                        className={`aspect-square rounded-lg border-2 transition-all ${activeMode === mode.id ? 'border-brand-green-deep scale-110' : 'border-transparent opacity-60'}`}
                        style={{ background: mode.id === 'NATURE' ? 'linear-gradient(135deg, #1E4D2B, #E4A201)' : MODE_DATA.find(m => m.id === mode.id)?.colors[0] }}
                        title={mode.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-4">
                       <span className="text-xs font-black text-brand-gray-navy/40 uppercase">Texture Intensity</span>
                       <span className="text-xs font-black text-brand-green-deep">{bgIntensity}%</span>
                    </div>
                    <input 
                      type="range" 
                      value={bgIntensity} 
                      onChange={(e) => setBgIntensity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-green-deep" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-4">
                       <span className="text-xs font-black text-brand-gray-navy/40 uppercase">Grain & Noise</span>
                       <span className="text-xs font-black text-brand-green-deep">{bgGrain}%</span>
                    </div>
                    <input 
                      type="range" 
                      value={bgGrain} 
                      onChange={(e) => setBgGrain(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-green-deep" 
                    />
                  </div>
                </div>

                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-brand-gray-navy/40 mb-4">Visual Atmosphere</h3>
                   <div className="flex flex-wrap gap-2">
                      {['CINEMATIC', 'MINIMAL', 'EDITORIAL', 'ARTISTIC', 'ORGANIC'].map(v => (
                        <button 
                          key={v}
                          onClick={() => setBgAtmosphere(v)}
                          className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${bgAtmosphere === v ? 'bg-brand-gold-harvest text-black shadow-lg shadow-brand-gold-harvest/20' : 'bg-gray-100 text-brand-gray-navy/40 hover:bg-gray-200'}`}
                        >
                          {v}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <div className="bg-brand-gray-navy p-8 rounded-[2rem] text-white space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-white/30">Generation Data</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl">
                       <div className="text-[10px] opacity-40 uppercase mb-1">Style</div>
                       <div className="text-xs font-bold">{bgAtmosphere}</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl">
                       <div className="text-[10px] opacity-40 uppercase mb-1">Composition</div>
                       <div className="text-xs font-bold">Layered Gradient</div>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-brand-green-accent text-brand-green-deep rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all">
                    توليد نسخة بديلة
                 </button>
              </div>
            </div>

            {/* Background Preview */}
            <div className="lg:col-span-8">
               <div className="sticky top-32">
                  <div className="bg-white p-2 rounded-[3.5rem] shadow-2xl border border-black/5 overflow-hidden">
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden group">
                      <BackgroundArt mode={activeMode} content={bgContentMode} intensity={bgIntensity} grain={bgGrain} atmosphere={bgAtmosphere} />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-sm pointer-events-none">
                         <div className="px-6 py-3 bg-white rounded-full shadow-2xl text-[10px] font-black tracking-[0.3em] uppercase">Previewing Atmosphere</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center px-4" dir="rtl">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green-accent" />
                        <span className="text-[10px] font-black text-brand-gray-navy/40 uppercase italic tracking-widest">No Text Layers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green-accent" />
                        <span className="text-[10px] font-black text-brand-gray-navy/40 uppercase italic tracking-widest">No Branding</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-brand-green-deep uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">
                      تحميل الخلفية الخام <Download className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 pt-12 animate-in fade-in duration-700">
           <header className="mb-16" dir="rtl">
            <h1 className="text-6xl font-black tracking-tighter text-brand-green-deep mb-4 uppercase">Style Engine.</h1>
            <p className="text-2xl text-brand-gray-navy/60 max-w-3xl leading-relaxed">
              حوّل الألوان إلى هوية محتوى متكاملة. نظام ذكاء بصري يحدد القواعد التصميمية والروح الإبداعية لكل منشور.
            </p>
          </header>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Mode Selection Sidebar */}
            <div className="lg:col-span-4 space-y-4" dir="rtl">
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray-navy/40 mb-6">اختر نمط الهوية</h3>
              <div className="grid grid-cols-1 gap-2">
                {MODE_DATA.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-right ${activeMode === mode.id ? 'border-brand-green-deep bg-white shadow-xl' : 'border-transparent bg-white/50 hover:bg-white'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl shadow-inner ${mode.bg}`} style={{ background: mode.id === 'NATURE' ? 'linear-gradient(135deg, #1E4D2B, #E4A201)' : '' }} />
                    <div className="flex-1">
                       <div className="font-black text-lg text-brand-green-deep leading-tight">{mode.name}</div>
                       <div className="text-[10px] font-bold uppercase opacity-40">{mode.sub}</div>
                    </div>
                    {activeMode === mode.id && <CheckCircle2 className="w-5 h-5 text-brand-green-accent" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Direction & Output */}
            <div className="lg:col-span-8">
               <div className="bg-white rounded-[3.5rem] shadow-2xl border border-black/5 overflow-hidden flex flex-col">
                  {/* Top: Visualization */}
                  <div className={`p-12 ${MODE_DATA.find(m => m.id === activeMode)?.bg} min-h-[300px] flex items-center justify-center relative shadow-inner`} style={{ background: activeMode === 'NATURE' ? 'linear-gradient(135deg, #1E4D2B, #4CAF50, #E4A201)' : '' }}>
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.2) 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
                      <div className="relative z-10 flex flex-col items-center text-center">
                         <AllanLogo mode={activeMode} className="scale-150 mb-8" />
                         <div className={`text-sm font-black px-4 py-1.5 rounded-full backdrop-blur-md border ${['HARVEST', 'NATURE', 'DARK', 'PODCAST'].includes(activeMode) ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-brand-green-deep border-black/10'}`}>
                            IDENTITY SYSTEM ACTIVE
                         </div>
                      </div>
                  </div>

                  {/* Middle: Specs Table */}
                  <div className="p-10 lg:p-12" dir="rtl">
                    <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                       {[
                         { label: 'نوع المحتوى المقترح', key: 'type', icon: Layout },
                         { label: 'التوجه البصري', key: 'visual', icon: ImageIcon },
                         { label: 'النظام التيبوغرافي', key: 'typography', icon: Type },
                         { label: 'اللغة الجرافيكية', key: 'graphic', icon: Sparkles },
                         { label: 'نَمط الخلفية', key: 'background', icon: Sun },
                         { label: 'النبرة العاطفية', key: 'tone', icon: Mic },
                       ].map(spec => (
                         <div key={spec.key} className="space-y-2">
                            <div className="flex items-center gap-2 text-brand-gray-navy/40">
                               <spec.icon className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{spec.label}</span>
                            </div>
                            <div className="text-sm font-bold text-brand-green-deep leading-relaxed">
                               {(MODE_DATA.find(m => m.id === activeMode)?.direction as any)[spec.key]}
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Headline & Tagline Section */}
                    <div className="mt-12 pt-10 border-t border-gray-100 grid lg:grid-cols-2 gap-8">
                       <div className="p-6 bg-brand-green-deep rounded-3xl text-white relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Suggested Arabic Headline</div>
                          <div className="text-2xl font-black">{(MODE_DATA.find(m => m.id === activeMode) as any).direction.headline}</div>
                       </div>
                       <div className="p-6 bg-brand-gold-harvest rounded-3xl text-brand-green-deep relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-green-deep/5 rounded-full blur-2xl group-hover:bg-brand-green-deep/10 transition-all" />
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Optional English Tagline</div>
                          <div className="text-xl font-black italic tracking-tight">{(MODE_DATA.find(m => m.id === activeMode) as any).direction.tagline}</div>
                       </div>
                    </div>
                  </div>

                  {/* Bottom: Color Palette Extraction */}
                  <div className="bg-gray-50 border-t border-gray-100 p-10 lg:p-12">
                     <div className="flex items-center justify-between mb-8" dir="rtl">
                        <h4 className="text-sm font-black text-brand-gray-navy/40 uppercase tracking-widest">مستخلص الألوان (Core Palette)</h4>
                        <div className="flex gap-2">
                           <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-black/5"><Share2 className="w-4 h-4 opacity-40" /></button>
                           <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-black/5"><Download className="w-4 h-4 opacity-40" /></button>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {(MODE_DATA.find(m => m.id === activeMode)?.colors || []).map((hex, i) => {
                          const name = BRAND_COLORS.find(c => c.hex === hex)?.name || `Color ${i+1}`;
                          return (
                            <div key={i} className="bg-white p-3 rounded-2xl border border-black/5 shadow-sm">
                               <div className="w-full aspect-video rounded-xl mb-3 shadow-inner" style={{ backgroundColor: hex }} />
                               <div className="text-[10px] font-black text-brand-gray-navy truncate">{name}</div>
                               <div className="text-[9px] font-mono text-brand-gray-navy/40 mt-1 uppercase">{hex}</div>
                            </div>
                          );
                        })}
                        {/* Always add primary neutrals to complete palette if context allows */}
                        <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-sm opacity-50">
                            <div className="w-full aspect-video rounded-xl mb-3 shadow-inner bg-[#F8F4EA]" />
                            <div className="text-[10px] font-black text-brand-gray-navy truncate">أبيض عاجي</div>
                            <div className="text-[9px] font-mono text-brand-gray-navy/40 mt-1 uppercase">#F8F4EA</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>
      )}

      {/* Action Footer */}
      <footer className="mt-20 pt-10 border-t border-brand-gray-navy/10 px-6 max-w-7xl mx-auto pb-20" dir="rtl">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-brand-gray-navy/20 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
            Allan Brand Content Lab <div className="w-1 h-1 bg-brand-gold-harvest rounded-full" /> 2026
          </div>
          <div className="flex gap-8">
             <button className="text-brand-gray-navy/40 hover:text-brand-green-deep transition-colors text-[10px] font-black uppercase tracking-widest">Brand Guidelines</button>
             <button className="text-brand-gray-navy/40 hover:text-brand-green-deep transition-colors text-[10px] font-black uppercase tracking-widest">Asset Vault</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
