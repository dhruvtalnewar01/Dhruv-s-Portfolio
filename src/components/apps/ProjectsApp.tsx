import { motion } from 'framer-motion';
import { LiveProjectButton } from '../ui/LiveProjectButton';
import { FadeIn } from '../ui/FadeIn';
import { TiltCard } from '../ui/TiltCard';

// Updated data structure with support for text content and custom links
type ProjectDataType = {
  id: number;
  number: string;
  category: string;
  name: string;
  images: {
    leftTop: string;
    leftBottom: string;
    right: string;
  };
  content?: {
    problem: string;
    built: string;
    bullets: string[];
    tags: string[];
  };
  links?: {
    live?: string;
    github?: string;
  };
};

const projectsData: ProjectDataType[] = [
  {
    id: 1,
    number: "01",
    category: "Healthcare",
    name: "CHD MultiModal AI",
    images: {
      leftTop: "",
      leftBottom: "",
      right: "/PROJECT 1.png"
    },
    content: {
      problem: "Conventional cardiovascular risk assessment is fragmented across heterogeneous clinical variables, statistical risk models, and guideline-heavy decision workflows. This makes it difficult to transform patient-level signals into a single, interpretable risk picture while preserving traceability and clinical oversight.",
      built: "A clinical AI decision-support platform for early coronary heart disease risk stratification that combines structured predictive modeling with stateful AI orchestration and evidence retrieval. The system routes patient data through specialized analytical stages, evaluates established cardiovascular risk formulations, generates model-based explanations, retrieves relevant medical evidence, and assembles the resulting analysis into a structured clinical report. The backend is exposed through an asynchronous FastAPI service and backed by persistent relational, caching, experiment-tracking, and vector-retrieval infrastructure.",
      bullets: [
        "Architected a stateful LangGraph clinical-reasoning workflow integrating biomarker analysis, risk stratification, evidence retrieval, and synthesis",
        "Combined XGBoost + scikit-learn predictive modeling with SHAP-based interpretability and vector-semantic retrieval for traceable analytical outputs",
        "Built a production-oriented FastAPI/ASGI serving layer with PostgreSQL, Redis, Celery, MLflow, Prometheus instrumentation, and HL7/FHIR interoperability foundations"
      ],
      tags: [
        "LangGraph Orchestration",
        "Gemini Clinical LLM",
        "XGBoost Risk Engine",
        "Clinical RAG + Embeddings",
        "FHIR / HL7 Interop",
        "FastAPI + PostgreSQL"
      ]
    },
    links: {
      live: "https://chdpredictor.netlify.app/",
      github: "https://github.com/dhruvtalnewar01/Early-Coronary-Heart-Disease-Predictor"
    }
  },
  {
    id: 2,
    number: "02",
    category: "India-First Multimodal Road Safety Intelligence",
    name: "ATMANIRBHAR AI",
    images: {
      leftTop: "/AtmaNirbhar_AI_1.png",
      leftBottom: "/AtmaNirbhar_AI_2.png",
      right: ""
    },
    content: {
      problem: "Conventional ADAS and perception systems are optimized around structured road geometry, reliable lane markings, relatively predictable traffic behavior, and clean visual conditions. Indian road environments routinely violate these assumptions through unmarked traffic corridors, heterogeneous vehicles, two-wheelers, livestock, pedestrians, potholes, construction hazards, low-light conditions, and severe acoustic clutter. A useful safety stack therefore has to reason across objects, depth, motion, audio, proximity, and temporal interaction, rather than relying on lane-centric perception alone.",
      built: "An India-first multimodal road-safety intelligence engine that fuses YOLO11 perception, ByteTrack temporal identity, Depth-Anything-V2 monocular depth, ego-motion compensation, YAMNet acoustic emergency detection, deterministic Time-to-Collision analysis, pairwise collision reasoning, explainable risk attribution, and selective VLM verification. The system converts road video and audio into object-level risk intelligence, near-miss events, contextual voice alerts, and structured safety telemetry through a FastAPI inference layer.",
      bullets: [
        "Engineered a multimodal perception pipeline combining custom road-object detection, temporal tracking, low-light enhancement, monocular depth, ego-motion compensation, and acoustic siren fusion for heterogeneous Indian traffic scenarios.",
        "Built a predictive safety layer using metric-distance estimation, closing velocity, TTC, pairwise convergence analysis, track-level class stabilization, and deterministic risk attribution instead of allowing an LLM to make safety decisions.",
        "Added selective multimodal verification, graceful sensor degradation, structured telemetry, and cockpit visualization designed as a foundation for hardware-accelerated edge deployment.",
      ],
      tags: ["YOLO11", "Depth-Anything-V2", "ByteTrack", "YAMNet", "OpenAI VLM", "PyTorch", "OpenCV", "FastAPI", "ONNX Runtime", "Next.js", "Three.js"]
    },
    links: {
      live: "https://atmanirbharai.netlify.app/",
      github: "https://github.com/dhruvtalnewar01/AtmaNirbhar-AI"
    }
  },
  {
    id: 3,
    number: "03",
    category: "Healthcare",
    name: "Disease Outbreak Intelligence AI",
    images: {
      leftTop: "/PROJECT_2_IMG_1.png",
      leftBottom: "/3rd.png",
      right: ""
    },
    content: {
      problem: "Traditional healthcare surveillance and diagnostic systems are insanely clunky and reactive. Clinicians and patients are stuck dealing with fragmented data silos, making it almost impossible to get real time, actionable intelligence before critical health events occur.",
      built: "A bleeding edge, multimodal healthcare intelligence engine built specifically to tackle real world AI solutions under strict time constraints. I wired up a highly autonomous agentic architecture that ingests raw, unstructured biomedical signals and instantly synthesizes them into probabilistic health profiles. The core pipeline leverages a heavily optimized LLM router that dynamically processes intent, backed by a blazing fast vector database for zero hallucination medical context retrieval. It is served through a high concurrency backend that visualizes complex patient trajectories into ultra clean, human readable diagnostic summaries.",
      bullets: [
        "Engineered an autonomous multimodal routing system to process complex healthcare inputs on the fly",
        "Achieved zero latency NLP and strict fact grounding using advanced vector retrieval and state of the art LLMs",
        "Shipped a highly concurrent serving layer that translates probabilistic health data into instant actionable insights"
      ],
      tags: ["Python", "FastAPI", "LangGraph", "VectorDB", "AnthropicAPI"]
    },
    links: {
      live: "https://episentinalai.netlify.app/",
      github: "https://github.com/dhruvtalnewar01/pragyantra--HC_33---HC-3-"
    }
  },
  {
    id: 4,
    number: "04",
    category: "Fintech",
    name: "AI-Native Market Intelligence & Autonomous Execution Platform",
    images: {
      leftTop: "/PROJECT_3_IMG_1.png",
      leftBottom: "/PROJECT_3_IMG_2.png",
      right: ""
    },
    content: {
      problem: "Standard spatial computing and visual recognition systems are severely bottlenecked by cloud latency and rigid processing pipelines. They struggle to synthesize complex, dynamic physical environments in real time, resulting in fragmented and delayed spatial awareness when split-second contextual reasoning is absolutely critical.",
      built: "An agentic, multimodal spatial intelligence engine engineered for real time, edge-optimized visual reasoning. Drishti-Titan ingests continuous high-dimensional video streams and dynamically routes them through a severely optimized Vision-Language Model pipeline. By leveraging advanced TensorRT acceleration and a custom autonomous reasoning loop, the architecture instantly executes complex semantic segmentation, depth estimation, and dynamic object tracking. It completely bypasses traditional cloud dependencies to deliver hyper-accurate, hallucination-free environmental context and navigational intelligence entirely on the fly.",
      bullets: [
        "Engineered a heavily quantized Vision-Language pipeline for ultra-low latency semantic scene mapping and spatial reasoning",
        "Achieved zero-bottleneck visual processing by integrating TensorRT acceleration within a custom autonomous agentic loop",
        "Built a high-throughput edge architecture that translates dense physical environments into instant, context-aware intelligence"
      ],
      tags: ["Python", "TensorRT", "Vision-Language Models", "Edge AI", "LangGraph", "CUDA"]
    },
    links: {
      live: "https://drishtinexus.netlify.app/landing/index.html",
      github: "https://github.com/dhruvtalnewar01/Drishti-Titan"
    }
  },
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: i + 5,
    number: String(i + 5).padStart(2, '0'),
    category: "TBD",
    name: "Coming Soon",
    images: {
      leftTop: "",
      leftBottom: "",
      right: ""
    }
  }))
];

const GithubButton = ({ href }: { href?: string }) => {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <button className="relative overflow-hidden rounded-full border border-white/20 text-white/70 font-medium uppercase tracking-widest transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm flex items-center justify-center backdrop-blur-md group/btn">
        <span className="relative z-10">GitHub</span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-shimmer skew-x-12" />
      </button>
    </a>
  );
};

const ProjectCard = ({ project }: { project: ProjectDataType }) => {
  const content = project.content;
  const hasRightImage = !!project.images.right;
  const hasLeftImages = !!project.images.leftTop || !!project.images.leftBottom;

  const renderTextContent = (isRightColumn: boolean = false) => (
    <div className={`flex flex-col gap-6 sm:gap-7 md:w-[48%] h-full shrink-0 text-[#D7E2EA]/75 text-sm sm:text-base leading-relaxed relative z-20 ${isRightColumn ? 'md:w-full flex-1 md:pl-6 lg:pl-10' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#D7E2EA]/75">
          <strong className="text-white font-semibold text-base sm:text-[17px] tracking-wide block mb-1">The problem.</strong>
          {content?.problem}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#D7E2EA]/75">
          <strong className="text-white font-semibold text-base sm:text-[17px] tracking-wide block mb-1">What I built.</strong>
          {content?.built}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-2 mt-1"
      >
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-400/90 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          CORE ENGINEERING
        </span>
        <ul className="flex flex-col gap-2.5 mt-1">
          {content?.bullets.map((bullet, idx) => (
            <li key={idx} className="flex gap-3 items-start text-xs sm:text-sm text-[#D7E2EA]/75 leading-relaxed">
              <span className="text-emerald-400 mt-[1px] font-bold shrink-0">▸</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-2.5 mt-2"
      >
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-white/50 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          TECH STACK
        </span>
        <div className="flex flex-wrap gap-2">
          {content?.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[11px] sm:text-xs font-mono text-white/85 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-300 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderLeftImages = () => (
    <div className="flex flex-col gap-5 sm:gap-6 md:w-[48%] h-auto md:h-full shrink-0">
      <div className="w-full flex-1 min-h-[220px] sm:min-h-[260px] md:min-h-[280px] bg-[#050505] rounded-[24px] sm:rounded-[36px] overflow-hidden relative group/img shadow-[0_0_30px_rgba(255,255,255,0.03)] border border-white/10 flex items-center justify-center p-2 sm:p-3">
        {project.images.leftTop ? (
          <>
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <img src={project.images.leftTop} alt="" className="w-full h-full object-cover blur-[50px] opacity-30 scale-125" />
            </div>
            <img 
              src={project.images.leftTop} 
              alt={`${project.name} Interface 1`} 
              className="relative z-10 max-w-full max-h-full object-contain rounded-[18px] sm:rounded-[28px] group-hover/img:scale-[1.02] transition-transform duration-[1.2s] ease-out filter drop-shadow-2xl" 
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/5 font-mono">Coming Soon</div>
        )}
      </div>

      <div className="w-full flex-1 min-h-[220px] sm:min-h-[260px] md:min-h-[280px] bg-[#050505] rounded-[24px] sm:rounded-[36px] overflow-hidden relative group/img shadow-[0_0_30px_rgba(255,255,255,0.03)] border border-white/10 flex items-center justify-center p-2 sm:p-3">
        {project.images.leftBottom ? (
          <>
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <img src={project.images.leftBottom} alt="" className="w-full h-full object-cover blur-[50px] opacity-30 scale-125" />
            </div>
            <img 
              src={project.images.leftBottom} 
              alt={`${project.name} Interface 2`} 
              className="relative z-10 max-w-full max-h-full object-contain rounded-[18px] sm:rounded-[28px] group-hover/img:scale-[1.02] transition-transform duration-[1.2s] ease-out filter drop-shadow-2xl" 
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/5 font-mono">Coming Soon</div>
        )}
      </div>
    </div>
  );

  const renderRightImage = () => (
    <div className="flex-1 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden min-h-[350px] md:min-h-[450px] h-full relative group/img shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-white/10 bg-[#050505] flex items-center justify-center p-3">
      {project.images.right ? (
        <>
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <img src={project.images.right} alt="" className="w-full h-full object-cover blur-[50px] opacity-40 scale-125 saturate-150" />
          </div>
          <img 
            src={project.images.right} 
            alt={`${project.name} Main`} 
            className="relative z-10 max-w-full max-h-full object-contain rounded-[20px] sm:rounded-[35px] group-hover/img:scale-105 transition-transform duration-[2s] ease-out filter brightness-110 contrast-125 saturate-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/5 font-mono">Coming Soon</div>
      )}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute inset-0 z-30 pointer-events-none mix-blend-screen opacity-0 group-hover/img:opacity-100 transition-opacity duration-[2s] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
    </div>
  );

  return (
    <div className="min-h-[100vh] w-full flex items-center justify-center py-20 px-4 sm:p-8 md:p-12 lg:px-24 snap-start relative">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <TiltCard className="w-full h-auto min-h-[75vh] bg-[#0C0C0C]/80 backdrop-blur-xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-white/10 p-6 sm:p-8 md:p-12 flex flex-col gap-8 shadow-2xl overflow-hidden group">
        
        {/* Top Row: Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <span className="text-[5rem] sm:text-[6rem] md:text-[8rem] font-black text-white/10 leading-none group-hover:text-white/20 transition-colors duration-700">
              {project.number}
            </span>
            <div className="flex flex-col gap-2 md:pb-4 max-w-xl lg:max-w-2xl">
              <span className="text-[#D7E2EA]/60 text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] font-medium leading-relaxed">
                {project.category}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: "'Silkscreen', cursive" }}>
                {project.name}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 pt-4 md:pt-0 shrink-0">
            {project.links?.github && (
              <GithubButton href={project.links.github} />
            )}
            {project.links?.live ? (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                <LiveProjectButton className="group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-500" />
              </a>
            ) : (
              <LiveProjectButton className="group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-500" />
            )}
          </div>
        </div>

        {/* Bottom Row: Dynamic Layouts */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 min-h-0 relative z-10">
          
          {/* Logic: If it has left images AND text content (No right image) => Left: Images, Right: Text */}
          {hasLeftImages && content && !hasRightImage ? (
            <>
              {renderLeftImages()}
              {renderTextContent(true)}
            </>
          ) : content && hasRightImage ? (
            /* Logic: If it has text content AND right image => Left: Text, Right: Image */
            <>
              {renderTextContent()}
              {renderRightImage()}
            </>
          ) : (
            /* Default Logic: No text content => Left: Images, Right: Image */
            <>
              {renderLeftImages()}
              {renderRightImage()}
            </>
          )}

        </div>
      </TiltCard>
    </div>
  );
};

export const ProjectsApp = () => {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#050505] font-sans selection:bg-white selection:text-black scroll-smooth snap-y snap-mandatory">
      
      {/* Title Section */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center snap-start relative">
        <FadeIn y={50} duration={1}>
          <div className="flex flex-col items-center gap-6">
            <span className="text-white/40 tracking-[0.5em] text-sm md:text-base uppercase">
              Portfolio Interactive
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter bg-gradient-to-br from-white via-white/80 to-white/10 bg-clip-text text-transparent">
              Projects
            </h1>
          </div>
        </FadeIn>
        
        {/* Scroll down indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </div>

      <div className="w-full flex flex-col relative z-10 pb-24">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
