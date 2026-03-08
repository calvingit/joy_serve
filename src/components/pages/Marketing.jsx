/* 智能营销页面：展示营销触达与评价运营概览。 */
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Cpu,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Flag,
  FlaskConical,
  Home,
  Image,
  Inbox,
  Info,
  Key,
  Lock,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Minus,
  Pause,
  Paperclip,
  Play,
  Plus,
  RefreshCcw,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Trash2,
  Upload,
  User,
  UserPlus,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { D, DATA, LANG_FLAG } from "../../constants/data";
import { useModal } from "../../hooks/useModal";
import {
  Btn,
  Card,
  CTip,
  Chip,
  Confirm,
  Field,
  HealthBar,
  Input,
  Modal,
  PHeader,
  SLabel,
  Sel,
  TabBar,
  Textarea,
  Toggle,
} from "../common/components";

export default function Marketing({ toast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PHeader title="智能营销" sub="主动触达 · 优惠券管理 · 评价运营" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[
          { icon: "🎯", t: "主动触达规则", n: 8, a: 5 },
          { icon: "🎁", t: "活跃优惠券", n: 24, a: 12 },
          { icon: "⭐", t: "待回复评价", n: 142, a: 18 },
        ].map((c, i) => (
          <Card key={i} pad={20} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: D.t1, marginBottom: 4, letterSpacing: "-0.4px" }}>{c.n}</div>
            <p style={{ fontSize: 13, color: D.t2, margin: "0 0 8px" }}>{c.t}</p>
            <Chip type="slate">{c.a} 活跃</Chip>
          </Card>
        ))}
      </div>
      <Card>
        <p style={{ fontSize: 13, color: D.t3, textAlign: "center", padding: "32px 0", margin: 0 }}>
          购后关怀时间线、催付催评、评价运营等完整功能，详见产品设计文档
        </p>
      </Card>
    </div>
  );
}
