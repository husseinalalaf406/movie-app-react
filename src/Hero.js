import { useState, useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import IconBadge from "./IconBadge";

// ============================================================
// 🎬 WebGL Shaders — DarkVeil visual effect (unchanged)
// ============================================================
const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
#ifdef GL_ES
precision lowp float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;
#define iTime uTime
#define iResolution uResolution

vec4 buf[8];
float rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}
mat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);
mat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);

vec3 hueShiftRGB(vec3 col,float deg){
    vec3 yiq=rgb2yiq*col;
    float rad=radians(deg);
    float cosh=cos(rad),sinh=sin(rad);
    vec3 yiqShift=vec3(yiq.x,yiq.y*cosh-yiq.z*sinh,yiq.y*sinh+yiq.z*cosh);
    return clamp(yiq2rgb*yiqShift,0.0,1.0);
}
vec4 sigmoid(vec4 x){return 1./(1.+exp(-x));}

vec4 cppn_fn(vec2 coordinate,float in0,float in1,float in2){
    buf[6]=vec4(coordinate.x,coordinate.y,0.3948333106474662+in0,0.36+in1);
    buf[7]=vec4(0.14+in2,sqrt(coordinate.x*coordinate.x+coordinate.y*coordinate.y),0.,0.);
    buf[0]=mat4(vec4(6.5404263,-3.6126034,0.7590882,-1.13613),vec4(2.4582713,3.1660357,1.2219609,0.06276096),vec4(-5.478085,-6.159632,1.8701609,-4.7742867),vec4(6.039214,-5.542865,-0.90925294,3.251348))*buf[6]+mat4(vec4(0.8473259,-5.722911,3.975766,1.6522468),vec4(-0.24321538,0.5839259,-1.7661959,-5.350116),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(0.218089433,1.1243913,-1.7969975,5.0294676);
    buf[1]=mat4(vec4(-3.3522482,-6.0612736,0.55641043,-4.4719114),vec4(0.8631464,1.7432913,5.643898,1.6106541),vec4(2.4941394,-3.5012043,1.7184316,6.357333),vec4(3.310376,8.209261,1.1355612,-1.165539))*buf[6]+mat4(vec4(5.24046,-13.034365,0.009859298,15.870829),vec4(2.987511,3.129433,-0.89023495,-1.6822904),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-5.9457836,-6.573602,-0.8812491,1.5436668);
    buf[0]=sigmoid(buf[0]);buf[1]=sigmoid(buf[1]);
    buf[2]=mat4(vec4(-15.219568,8.095543,-2.429353,-1.9381982),vec4(-5.951362,4.3115187,2.6393783,1.274315),vec4(-7.3145227,6.7297835,5.2473326,5.9411426),vec4(5.0796127,8.979051,-1.7278991,-1.158976))*buf[6]+mat4(vec4(-11.967154,-11.608155,6.1486754,11.237008),vec4(2.124141,-6.263192,-1.7050359,-0.7021966),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-4.17164,-3.2281182,-4.576417,-3.6401186);
    buf[3]=mat4(vec4(3.1832156,-13.738922,1.879223,3.233465),vec4(0.64300746,12.768129,1.9141049,0.50990224),vec4(-0.049295485,4.4807224,1.4733979,1.801449),vec4(5.0039253,13.000481,3.3991797,-4.5561905))*buf[6]+mat4(vec4(-0.1285731,7.720628,-3.1425676,4.742367),vec4(0.6393625,3.714393,-0.8108378,-0.39174938),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-1.1811101,-21.621881,0.7851888,1.2329718);
    buf[2]=sigmoid(buf[2]);buf[3]=sigmoid(buf[3]);
    buf[4]=mat4(vec4(5.214916,-7.183024,2.7228765,2.6592617),vec4(-5.601878,-25.3591,4.067988,0.4602802),vec4(-10.57759,24.286327,21.102104,37.546658),vec4(4.3024497,-1.9625226,2.3458803,-1.372816))*buf[0]+mat4(vec4(-17.6526,-10.507558,2.2587414,12.462782),vec4(6.265566,-502.75443,-12.642513,0.9112289),vec4(-10.983244,20.741234,-9.701768,-0.7635988),vec4(5.383626,1.4819539,-4.1911616,-4.8444734))*buf[1]+mat4(vec4(12.785233,-16.345072,-0.39901125,1.7955981),vec4(-30.48365,-1.8345358,1.4542528,-1.1118771),vec4(19.872723,-7.337935,-42.941723,-98.52709),vec4(8.337645,-2.7312303,-2.2927687,-36.142323))*buf[2]+mat4(vec4(-16.298317,3.5471997,-0.44300047,-9.444417),vec4(57.5077,-35.609753,16.163465,-4.1534753),vec4(-0.07470326,-3.8656476,-7.0901804,3.1523974),vec4(-12.559385,-7.077619,1.490437,-0.8211543))*buf[3]+vec4(-7.67914,15.927437,1.3207729,-1.6686112);
    buf[5]=mat4(vec4(-1.4109162,-0.372762,-3.770383,-21.367174),vec4(-6.2103205,-9.35908,0.92529047,8.82561),vec4(11.460242,-22.348068,13.625772,-18.693201),vec4(-0.3429052,-3.9905605,-2.4626114,-0.45033523))*buf[0]+mat4(vec4(7.3481627,-4.3661838,-6.3037653,-3.868115),vec4(1.5462853,6.5488915,1.9701879,-0.58291394),vec4(6.5858274,-2.2180402,3.7127688,-1.3730392),vec4(-5.7973905,10.134961,-2.3395722,-5.965605))*buf[1]+mat4(vec4(-2.5132585,-6.6685553,-1.4029363,-0.16285264),vec4(-0.37908727,0.53738135,4.389061,-1.3024765),vec4(-0.70647055,2.0111287,-5.1659346,-3.728635),vec4(-13.562562,10.487719,-0.9173751,-2.6487076))*buf[2]+mat4(vec4(-8.645013,6.5546675,-6.3944063,-5.5933375),vec4(-0.57783127,-1.077275,36.91025,5.736769),vec4(14.283112,3.7146652,7.1452246,-4.5958776),vec4(2.7192075,3.6021907,-4.366337,-2.3653464))*buf[3]+vec4(-5.9000807,-4.329569,1.2427121,8.59503);
    buf[4]=sigmoid(buf[4]);buf[5]=sigmoid(buf[5]);
    buf[6]=mat4(vec4(-1.61102,0.7970257,1.4675229,0.20917463),vec4(-28.793737,-7.1390953,1.5025433,4.656581),vec4(-10.94861,39.66238,0.74318546,-10.095605),vec4(-0.7229728,-1.5483948,0.7301322,2.1687684))*buf[0]+mat4(vec4(3.2547753,21.489103,-1.0194173,-3.3100595),vec4(-3.7316632,-3.3792162,-7.223193,-0.23685838),vec4(13.1804495,0.7916005,5.338587,5.687114),vec4(-4.167605,-17.798311,-6.815736,-1.6451967))*buf[1]+mat4(vec4(0.604885,-7.800309,-7.213122,-2.741014),vec4(-3.522382,-0.12359311,-0.5258442,0.43852118),vec4(9.6752825,-22.853785,2.062431,0.099892326),vec4(-4.3196306,-17.730087,2.5184598,5.30267))*buf[2]+mat4(vec4(-6.545563,-15.790176,-6.0438633,-5.415399),vec4(-43.591583,28.551912,-16.00161,18.84728),vec4(4.212382,8.394307,3.0958717,8.657522),vec4(-5.0237565,-4.450633,-4.4768,-5.5010443))*buf[3]+mat4(vec4(1.6985557,-67.05806,6.897715,1.9004834),vec4(1.8680354,2.3915145,2.5231109,4.081538),vec4(11.158006,1.7294737,2.0738268,7.386411),vec4(-4.256034,-306.24686,8.258898,-17.132736))*buf[4]+mat4(vec4(1.6889864,-4.5852966,3.8534803,-6.3482175),vec4(1.3543309,-1.2640043,9.932754,2.9079645),vec4(-5.2770967,0.07150358,-0.13962056,3.3269649),vec4(28.34703,-4.918278,6.1044083,4.085355))*buf[5]+vec4(6.6818056,12.522166,-3.7075126,-4.104386);
    buf[7]=mat4(vec4(-8.265602,-4.7027016,5.098234,0.7509808),vec4(8.6507845,-17.15949,16.51939,-8.884479),vec4(-4.036479,-2.3946867,-2.6055532,-1.9866527),vec4(-2.2167742,-1.8135649,-5.9759874,4.8846445))*buf[0]+mat4(vec4(6.7790847,3.5076547,-2.8191125,-2.7028968),vec4(-5.743024,-0.27844876,1.4958696,-5.0517144),vec4(13.122226,15.735168,-2.9397483,-4.101023),vec4(-14.375265,-5.030483,-6.2599335,2.9848232))*buf[1]+mat4(vec4(4.0950394,-0.94011575,-5.674733,4.755022),vec4(4.3809423,4.8310084,1.7425908,-3.437416),vec4(2.117492,0.16342592,-104.56341,16.949184),vec4(-5.22543,-2.994248,3.8350096,-1.9364246))*buf[2]+mat4(vec4(-5.900337,1.7946124,-13.604192,-3.8060522),vec4(6.6583457,31.911177,25.164474,91.81147),vec4(11.840538,4.1503043,-0.7314397,6.768467),vec4(-6.3967767,4.034772,6.1714606,-0.32874924))*buf[3]+mat4(vec4(3.4992442,-196.91893,-8.923708,2.8142626),vec4(3.4806502,-3.1846354,5.1725626,5.1804223),vec4(-2.4009497,15.585794,1.2863957,2.0252278),vec4(-71.25271,-62.441242,-8.138444,0.50670296))*buf[4]+mat4(vec4(-12.291733,-11.176166,-7.3474145,4.390294),vec4(10.805477,5.6337385,-0.9385842,-4.7348723),vec4(-12.869276,-7.039391,5.3029537,7.5436664),vec4(1.4593618,8.91898,3.5101583,5.840625))*buf[5]+vec4(2.2415268,-6.705987,-0.98861027,-2.117676);
buf[6]=sigmoid(buf[6]);buf[7]=sigmoid(buf[7]);
buf[0]=mat4(vec4(1.6794263,1.3817469,2.9625452,0.),vec4(-1.8834411,-1.4806935,-3.5924516,0.),vec4(-1.3279216,-1.0918057,-2.3124623,0.),vec4(0.2662234,0.23235129,0.44178495,0.))*buf[0]+mat4(vec4(-0.6299101,-0.5945583,-0.9125601,0.),vec4(0.17828953,0.18300213,0.18182953,0.),vec4(-2.96544,-2.5819945,-4.9001055,0.),vec4(1.4195864,1.1868085,2.5176322,0.))*buf[1]+mat4(vec4(-1.2584374,-1.0552157,-2.1688404,0.),vec4(-0.7200217,-0.52666044,-1.438251,0.),vec4(0.15345335,0.15196142,0.272854,0.),vec4(0.945728,0.8861938,1.2766753,0.))*buf[2]+mat4(vec4(-2.4218085,-1.968602,-4.35166,0.),vec4(-22.683098,-18.0544,-41.954372,0.),vec4(0.63792,0.5470648,1.1078634,0.),vec4(-1.5489894,-1.3075932,-2.6444845,0.))*buf[3]+mat4(vec4(-0.49252132,-0.39877754,-0.91366625,0.),vec4(0.95609266,0.7923952,1.640221,0.),vec4(0.30616966,0.15693925,0.8639857,0.),vec4(1.1825981,0.94504964,2.176963,0.))*buf[4]+mat4(vec4(0.35446745,0.3293795,0.59547555,0.),vec4(-0.58784515,-0.48177817,-1.0614829,0.),vec4(2.5271258,1.9991658,4.6846647,0.),vec4(0.13042648,0.08864098,0.30187556,0.))*buf[5]+mat4(vec4(-1.7718065,-1.4033192,-3.3355875,0.),vec4(3.1664357,2.638297,5.378702,0.),vec4(-3.1724713,-2.6107926,-5.549295,0.),vec4(-2.851368,-2.249092,-5.3013067,0.))*buf[6]+mat4(vec4(1.5203838,1.2212278,2.8404984,0.),vec4(1.5210563,1.2651345,2.683903,0.),vec4(2.9789467,2.4364579,5.2347264,0.),vec4(2.2270417,1.8825914,3.8028636,0.))*buf[7]+vec4(-1.5468478,-3.6171484,0.24762098,0.);
buf[0]=sigmoid(buf[0]);
return vec4(buf[0].x,buf[0].y,buf[0].z,1.);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/uResolution.xy*2.-1.;
    uv.y*=-1.;
    uv+=uWarp*vec2(sin(uv.y*6.283+uTime*0.5),cos(uv.x*6.283+uTime*0.5))*0.05;
    fragColor=cppn_fn(uv,0.1*sin(0.3*uTime),0.1*sin(0.69*uTime),0.1*sin(0.44*uTime));
}

void main(){
    vec4 col;mainImage(col,gl_FragCoord.xy);
    col.rgb=hueShiftRGB(col.rgb,uHueShift);
    float scanline_val=sin(gl_FragCoord.y*uScanFreq)*0.5+0.5;
    col.rgb*=1.-(scanline_val*scanline_val)*uScan;
    col.rgb+=(rand(gl_FragCoord.xy+uTime)-0.5)*uNoise;
    gl_FragColor=vec4(clamp(col.rgb,0.0,1.0),1.0);
}
`;

// ── Suggestion prompts (language-aware) ───────────────────────
const SUGGESTIONS_EN = [
  "🎬 Long stressful day",
  "🤩 Hyped for action",
  "😢 Need a good cry",
  "🧠 Something thought-provoking",
];
const SUGGESTIONS_AR = [
  "🎬 يوم متعب ومرهق",
  "🤩 أبحث عن أكشن",
  "😢 أريد فيلم مؤثر",
  "🧠 شيء يحرك التفكير",
];

// ── TypingIndicator ────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="ai-msg-row ai-msg-row--bot">
      <div className="ai-avatar">🎬</div>
      <div className="ai-typing-bubble">
        <span className="ai-dot ai-dot--1" />
        <span className="ai-dot ai-dot--2" />
        <span className="ai-dot ai-dot--3" />
      </div>
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────
function Message({ text, isUser }) {
  return (
    <div className={`ai-msg-row ai-msg-row--${isUser ? "user" : "bot"} ai-msg`}>
      {!isUser && <div className="ai-avatar">🎬</div>}
      <div className={`ai-bubble ai-bubble--${isUser ? "user" : "bot"}`}>{text}</div>
    </div>
  );
}

// ── TMDB Genre IDs Dictionaries ───────────────────────────────
const GENRE_EN = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const GENRE_AR = {
  28: "أكشن", 12: "مغامرة", 16: "رسوم متحركة", 35: "كوميدي", 80: "جريمة",
  99: "وثائقي", 18: "دراما", 10751: "عائلي", 14: "خيال", 36: "تاريخ",
  27: "رعب", 10402: "موسيقى", 9648: "غموض", 10749: "رومانسية", 878: "خيال علمي",
  10770: "فيلم تلفزيوني", 53: "إثارة", 10752: "حرب", 37: "غرب أمريكي"
};

const getEnglishGenre = (id) => GENRE_EN[id] || "Movie";
const getArabicGenre = (id) => GENRE_AR[id] || "فيلم";

// ── Fallback Featured Movies (English & Arabic) ────────────────
const FALLBACKS = {
  en: {
    id: 823464, // Dune: Part Two id
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    backdrop: "https://image.tmdb.org/t/p/original/8Y4K2v77XC5enLls67OI3gZ6CcO.jpg",
    rating: "8.3",
    releaseYear: "2024",
    genres: "Sci-Fi / Adventure",
    tagline: "FEATURED PRESENTATION"
  },
  ar: {
    id: 823464,
    title: "كثبان: الجزء الثاني",
    overview: "يتحد بول أتريدس مع تشاني وفريمن أثناء سعيه للانتقام من المتآمرين الذين دمروا عائلته. في مواجهة الاختيار بين حب حياته ومصير الكون، يسعى جاهداً لمنع مستقبل رهيب لا يستطيع سواؤه توقعه.",
    backdrop: "https://image.tmdb.org/t/p/original/8Y4K2v77XC5enLls67OI3gZ6CcO.jpg",
    rating: "8.3",
    releaseYear: "2024",
    genres: "خيال علمي / مغامرة",
    tagline: "العرض السينمائي المميز"
  }
};

// ══════════════════════════════════════════════════════════════
// 🎬 MAIN HERO COMPONENT
// All API logic preserved exactly — only className-based markup.
// ══════════════════════════════════════════════════════════════
export default function Hero({
  hueShift          = 140,
  noiseIntensity    = 0.025,
  scanlineIntensity = 0.15,
  speed             = 0.25,
  scanlineFrequency = 1.5,
  warpAmount        = 0.35,
  resolutionScale   = 0.65,
}) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const messagesRef  = useRef(null);
  const textareaRef  = useRef(null);

  const [userInput, setUserInput] = useState("");
  const [messages,  setMessages]  = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Dynamic movie states
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isHeroLoading, setIsHeroLoading] = useState(true);

  // Detect Arabic input for RTL layout and Arabic suggestions
  const isInputArabic = /[\u0600-\u06FF]/.test(userInput);
  const isArabicMode = i18n.language === "ar" || isInputArabic;

  // ── Fetch Trending Movie from TMDB Language-aware ───────────
  useEffect(() => {
    const isArabic = i18n.language === 'ar';
    const apiLang = isArabic ? 'ar' : 'en-US';
    setIsHeroLoading(true);
    fetch(`/.netlify/functions/tmdb?path=${encodeURIComponent(`/trending/movie/week?language=${apiLang}`)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("TMDB response not ok");
        return res.json();
      })
      .then(async (data) => {
        if (data.results && data.results.length > 0) {
          // Select the first trending movie with a valid backdrop path
          const first = data.results.find(m => m.backdrop_path) || data.results[0];
          
          let movieOverview = first.overview;
          let movieTitle = first.title || first.original_title;

          // If in Arabic mode and overview or title is missing, fallback to English
          if (isArabic && (!movieOverview || movieOverview.trim() === "" || !movieTitle)) {
            try {
              const fallbackRes = await fetch(
                `/.netlify/functions/tmdb?path=${encodeURIComponent(`/movie/${first.id}?language=en-US`)}`
              );
              if (fallbackRes.ok) {
                const enData = await fallbackRes.json();
                if (!movieOverview || movieOverview.trim() === "") {
                  movieOverview = enData.overview || "";
                }
                if (!movieTitle) {
                  movieTitle = enData.title || first.original_title;
                }
              }
            } catch (fallbackErr) {
              console.warn("Could not fetch hero fallback overview:", fallbackErr);
            }
          }

          if (!movieOverview || movieOverview.trim() === "") {
            movieOverview = isArabic ? FALLBACKS.ar.overview : FALLBACKS.en.overview;
          }
          
          const genreNames = first.genre_ids && first.genre_ids.length > 0
            ? first.genre_ids.slice(0, 2).map(id => {
                return isArabic ? getArabicGenre(id) : getEnglishGenre(id);
              }).join(isArabic ? " ، " : " / ")
            : (isArabic ? "سينما" : "Cinema");

          setFeaturedMovie({
            id: first.id,
            title: movieTitle,
            overview: movieOverview,
            backdrop: first.backdrop_path 
              ? `https://image.tmdb.org/t/p/original${first.backdrop_path}` 
              : "https://image.tmdb.org/t/p/original/8Y4K2v77XC5enLls67OI3gZ6CcO.jpg",
            rating: first.vote_average ? first.vote_average.toFixed(1) : "8.5",
            releaseYear: first.release_date ? first.release_date.split("-")[0] : "2024",
            genres: genreNames,
            tagline: isArabic ? "العرض الأول الأكثر شعبية" : "NUMBER ONE TRENDING"
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching featured movie from TMDB:", err);
      })
      .finally(() => {
        setTimeout(() => {
          setIsHeroLoading(false);
        }, 1200);
      });
  }, [i18n.language]);

  // ── API key — unchanged from original ──────────────────────
  const GEMINI_API_KEY =
    (typeof process !== "undefined" && process.env?.REACT_APP_GEMINI_KEY) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_KEY) ||
    "";

  // ── Auto-scroll to bottom on new message ───────────────────
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  // ── Auto-grow textarea as user types ───────────────────────
  const handleTextareaChange = (e) => {
    setUserInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  // ── Ctrl/Cmd + Enter to send ────────────────────────────────
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleAskAI();
    }
  };

  // ── Fill suggestion chip into textarea ─────────────────────
  const applySuggestion = (text) => {
    const clean = text.replace(/^[\u{1F000}-\u{1FFFF}🎬🤩😢🧠]\s*/u, "");
    setUserInput(clean);
    textareaRef.current?.focus();
  };

  // ╔══════════════════════════════════════════════════════════╗
  // ║  API CALL — 100% preserved, no logic changed            ║
  // ╚══════════════════════════════════════════════════════════╝
  const handleAskAI = async () => {
    if (!userInput.trim() || isLoading) return;

    if (!GEMINI_API_KEY) {
      setMessages((prev) => [
        ...prev,
        { text: userInput, isUser: true },
        {
          text: t("aiErrorKey"),
          isUser: false,
        },
      ]);
      setUserInput("");
      return;
    }

    const prompt = userInput.trim();
    setMessages((prev) => [...prev, { text: prompt, isUser: true }]);
    setUserInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    const systemPrompt = isArabicMode
      ? `أنت خبير سينمائي ذكي للغاية. قم بتحليل مزاج أو سياق المستخدم الحالي واقترح من 3 إلى 5 أفلام أو مسلسلات تلفزيونية مطابقة. لكل منها، قدم العنوان ووصفاً من سطرين. أجب بالكامل باللغة العربية.`
      : `You are a highly intelligent movie expert. Analyze the user's current context/mood and recommend 3 to 5 matching movies or TV shows. For each, give the title and a 2-line description. Answer fully in English.`;

    const payload = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: prompt },
      ],
      max_tokens: 1000,
    };

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY.trim()}`,
          "HTTP-Referer":  window.location.origin || "http://localhost:3000",
          "X-Title":       "Movie Assistant App",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP Error ${response.status}`);
      }

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        setMessages((prev) => [
          ...prev,
          { text: data.choices[0].message.content, isUser: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: t("aiErrorGeneric"),
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("OpenRouter Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `${t("aiErrorOccurred")} ${error.message}`,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── WebGL setup — unchanged ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = containerRef.current;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
      alpha: true,
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime:       { value: 0 },
        uResolution: { value: new Vec2() },
        uHueShift:   { value: hueShift },
        uNoise:      { value: noiseIntensity },
        uScan:       { value: scanlineIntensity },
        uScanFreq:   { value: scanlineFrequency },
        uWarp:       { value: warpAmount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      program.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let frame = 0;

    const loop = () => {
      program.uniforms.uTime.value     = ((performance.now() - start) / 1000) * speed;
      program.uniforms.uHueShift.value = hueShift;
      program.uniforms.uNoise.value    = noiseIntensity;
      program.uniforms.uScan.value     = scanlineIntensity;
      program.uniforms.uScanFreq.value = scanlineFrequency;
      program.uniforms.uWarp.value     = warpAmount;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale]);

  // ── CTA click actions ─────────────────────────────────────────
  const activeFallback = i18n.language === "ar" ? FALLBACKS.ar : FALLBACKS.en;
  const activeMovie = featuredMovie || activeFallback;

  const handleWatchNow = () => {
    if (activeMovie && activeMovie.id) {
      navigate(`/movie/${activeMovie.id}`);
    } else {
      navigate(`/movie/823464`); // Dune: Part Two standard id
    }
  };

  const handleExploreMovies = () => {
    const el = document.getElementById("explore-movies-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasMessages  = messages.length > 0;
  const suggestions  = i18n.language === "ar" ? SUGGESTIONS_AR : SUGGESTIONS_EN;
  const dir          = isArabicMode ? "rtl" : "ltr";
  const appLanguage  = i18n.language || "en";

  // Triple-layer premium cinematic background blend
  const cinematicBgStyle = {
    backgroundImage: `
      linear-gradient(to bottom, rgba(10, 10, 15, 0) 0%, rgba(10, 10, 15, 0.95) 100%),
      radial-gradient(circle at ${isArabicMode ? "35% 35%" : "65% 35%"}, rgba(6, 6, 8, 0.05) 0%, rgba(6, 6, 8, 0.5) 55%, rgba(4, 4, 6, 0.98) 100%),
      linear-gradient(180deg, rgba(6, 6, 8, 0.25) 0%, rgba(6, 6, 8, 0.5) 45%, rgba(4, 4, 6, 1) 100%),
      linear-gradient(${isArabicMode ? "270deg" : "90deg"}, rgba(4, 4, 6, 0.96) 0%, rgba(6, 6, 8, 0.72) 40%, rgba(10, 10, 12, 0.15) 100%),
      url('${activeMovie.backdrop}')
    `
  };

  return (
    <div 
      ref={containerRef} 
      className="ai-hero" 
      style={cinematicBgStyle}
      dir={appLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Subtle vignette layer around the absolute edges */}
      <div className="ai-hero__vignette-edges" />

      {/* WebGL background layer — mixed in as high-tech digital shimmer texture */}
      <canvas ref={canvasRef} className="ai-hero__canvas" />

      {/* Main Responsive Grid Layout */}
      <div className="hero-content-grid">
        
        {/* Left Column: Epic Movie Presentation (Netflix/Disney style) */}
        <div className={`hero-presentation ${isHeroLoading ? "hero-skeleton-active" : ""}`}>
          {isHeroLoading ? (
            <div className="hero-skeleton-wrapper">
              <div className="hero-skeleton-tagline skeleton-pulsing" />
              <div className="hero-skeleton-title skeleton-pulsing" />
              <div className="hero-skeleton-meta-row">
                <div className="hero-skeleton-meta-badge skeleton-pulsing" />
                <div className="hero-skeleton-meta-badge skeleton-pulsing" />
                <div className="hero-skeleton-meta-badge skeleton-pulsing" />
              </div>
              <div className="hero-skeleton-description-line skeleton-pulsing" style={{ width: "95%" }} />
              <div className="hero-skeleton-description-line skeleton-pulsing" style={{ width: "85%" }} />
              <div className="hero-skeleton-description-line skeleton-pulsing" style={{ width: "60%" }} />
              <div className="hero-skeleton-cta-group">
                <div className="hero-skeleton-btn skeleton-pulsing" />
                <div className="hero-skeleton-btn skeleton-pulsing" />
              </div>
            </div>
          ) : (
            <>
              <div className="hero-tagline-wrapper">
                <span className="hero-premium-badge">PREMIUM</span>
                <span className="hero-tagline-text">{activeMovie.tagline || (appLanguage === "ar" ? "العرض السينمائي المميز" : "FEATURED PRESENTATION")}</span>
              </div>
              
              <h1 className="hero-movie-title">{activeMovie.title}</h1>
              
              {/* Floating Movie Information Badges */}
              <div className="hero-metadata-row">
                <span className="hero-meta-badge rating-badge">
                  <StarBorderOutlinedIcon className="star-icon-mui" /> {activeMovie.rating}
                </span>
                <span className="hero-meta-badge year-badge">{activeMovie.releaseYear}</span>
                <span className="hero-meta-badge genre-badge">{activeMovie.genres}</span>
              </div>
              
              <p className="hero-movie-description">{activeMovie.overview}</p>
              
              {/* Premium CTA Buttons */}
              <div className="hero-cta-group">
                <button 
                  onClick={handleWatchNow} 
                  className="hero-cta-btn btn-primary"
                  aria-label={appLanguage === "ar" ? "شاهد الآن" : "Watch Now"}
                >
                  <PlayArrowOutlinedIcon className="play-icon-mui" />
                  <span className="btn-text">{appLanguage === "ar" ? "شاهد الآن" : "Watch Now"}</span>
                </button>
                <button 
                  onClick={handleExploreMovies} 
                  className="hero-cta-btn btn-secondary"
                  aria-label={appLanguage === "ar" ? "استكشف الأفلام" : "Explore Movies"}
                >
                  <MovieOutlinedIcon className="reel-icon-mui" />
                  <span className="btn-text">{appLanguage === "ar" ? "استكشف الأفلام" : "Explore Movies"}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Existing Interactive AI Movie Assistant Card */}
        <div className="hero-companion-assistant">
          <div className="ai-card">

            {/* Green accent stripe at top */}
            <div className="ai-card__topbar" />

            {/* Header */}
            <div className="ai-card__header">
              <IconBadge icon={<SmartToyOutlinedIcon />} size="small" />
              <div className="ai-header-text">
                <p className="ai-header-title">
                  {t("aiAssistant")}
                </p>
                <p className="ai-header-sub">
                  {t("aiSub")}
                </p>
              </div>
              {/* Online indicator */}
              <span className="ai-live-dot" title="Online" />
            </div>

            {/* Message thread */}
            <div ref={messagesRef} className="ai-messages">

              {/* Welcome screen — shown before first message */}
              {!hasMessages && (
                <div className="ai-welcome">
                  <div className="ai-welcome-icon-container">
                    <svg viewBox="0 0 24 24" fill="none" className="ai-welcome-svg bot-glowing">
                      <defs>
                        <linearGradient id="bot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#25eb81" />
                          <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="url(#bot-grad)" opacity="0.1" />
                      <circle cx="12" cy="12" r="9" stroke="url(#bot-grad)" strokeWidth="1.5" />
                      <path d="M8 11.5c.83 0 1.5-.67 1.5-1.5S8.83 8.5 8 8.5 6.5 9.17 6.5 10s.67 1.5 1.5 1.5z" fill="#25eb81" />
                      <path d="M16 11.5c.83 0 1.5-.67 1.5-1.5S16.83 8.5 16 8.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" fill="#25eb81" />
                      <path d="M9 15.5c1.5 1.5 4.5 1.5 6 0" stroke="#25eb81" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M12 2V1" stroke="#25eb81" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="ai-welcome__title">
                    {t("aiWelcomeTitle")}
                  </p>
                  <p className="ai-welcome__text">
                    {t("aiWelcomeText")}
                  </p>
                </div>
              )}

              {/* Conversation messages */}
              {messages.map((msg, i) => (
                <Message key={i} text={msg.text} isUser={msg.isUser} />
              ))}

              {/* Typing dots while AI is thinking */}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Suggestion chips — only shown before conversation starts */}
            {!hasMessages && (
              <div className="ai-chips">
                {suggestions.map((s) => (
                  <button key={s} className="ai-chip" onClick={() => applySuggestion(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="ai-input-area" dir={dir}>
              <textarea
                ref={textareaRef}
                className="ai-textarea"
                value={userInput}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                dir={dir}
                placeholder={t("aiInputPlaceholder")}
                disabled={isLoading}
                rows={1}
              />
              <button
                className={`ai-send-btn${isLoading || !userInput.trim() ? " ai-send-btn--disabled" : ""}`}
                onClick={handleAskAI}
                disabled={isLoading || !userInput.trim()}
                aria-label="Send message"
              >
                {isLoading ? (
                  <HourglassEmptyOutlinedIcon className="ai-send-icon-mui" />
                ) : (
                  <ArrowUpwardOutlinedIcon className="ai-send-icon-mui" />
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
