import { useEffect, useRef, useState } from "react";
import { Bot, Image, MessageSquare, Paperclip, Play, Plus, RefreshCcw, Send, X } from 'lucide-react';
import { D } from "../../../constants/data";
import { useModal } from "../../../hooks/useModal";
import { Btn, Card, Modal } from "../../common/components";

const DEFAULT_QUICK = [
  '今日有什么运营异常？',
  'AI 覆盖率最低的场景是？',
  '退款趋势本周如何？',
  '本月 ROI 情况？',
];

const DEFAULT_SLASH = [
  { cmd: '/summary', label: '今日摘要', prompt: '请输出今日运营摘要，并按风险级别排序。' },
  { cmd: '/risk', label: '风险扫描', prompt: '请列出当前最高优先级风险及对应处置建议。' },
  { cmd: '/todo', label: '行动清单', prompt: '请生成今日可执行的运营行动清单（按优先级）。' },
  { cmd: '/compare', label: '环比对比', prompt: '请对比本周与上周关键指标变化并给出解释。' },
];

export default function DashboardAiAskPanel({
  toast,
  quickPrompts = DEFAULT_QUICK,
  slashCommands = DEFAULT_SLASH,
  modalTitle = 'AI 运营会话',
}) {
  const [aiQuery, setAiQ] = useState('');
  const [aiLoad, setAiLoad] = useState(false);
  const chatModal = useModal();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [composerText, setComposerText] = useState('');
  const [composerFiles, setComposerFiles] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashKeyword, setSlashKeyword] = useState('');
  const [slashSelected, setSlashSelected] = useState(0);
  const streamTimerRef = useRef(null);
  const msgEndRef = useRef(null);
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const nowLabel = () =>
    new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const fmtSize = (size) => {
    if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)}MB`;
    return `${Math.max(1, Math.round(size / 1024))}KB`;
  };
  const inferKind = (f) => {
    if (f.type?.startsWith('image/')) return 'image';
    if (f.type?.startsWith('video/')) return 'video';
    return 'file';
  };
  const getActiveSession = () => sessions.find((s) => s.id === activeSessionId) || null;
  const stopStream = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsStreaming(false);
    setAiLoad(false);
  };
  const buildAiText = (q, files = []) => {
    const fileHint = files.length
      ? `\n\n📎 已识别 ${files.length} 个附件，建议优先核验相关素材与会话上下文。`
      : '';
    return `针对「${q}」的分析：\n\n📊 本周 AI 独立解决率 87.3%，较上周提升 2.1pp，整体运营稳健。\n\n⚠️ 需关注：「取消订单」场景 AI 解决率仅 52%，低于行业均值 19pp，建议检查退款边界策略与人工接管阈值。\n\n✅ 建议行动：① 更新泰语退款话术 ② 检查 Shopee PH 授权状态 ③ 开启「主动关怀」Skill，预计可减少约 30% 物流投诉。${fileHint}`;
  };
  const updateSession = (sessionId, updater) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const next = updater(s);
        return { ...next, updatedAt: Date.now() };
      }),
    );
  };
  const applySlash = (item) => {
    setComposerText(`${item.prompt} `);
    setSlashOpen(false);
    setSlashKeyword('');
    setSlashSelected(0);
  };
  const doStream = ({ sessionId, aiMsgId, fullText, previewText }) => {
    stopStream();
    let idx = 0;
    setIsStreaming(true);
    setAiLoad(true);
    streamTimerRef.current = setInterval(() => {
      idx += 6;
      const next = fullText.slice(0, idx);
      updateSession(sessionId, (s) => ({
        ...s,
        messages: s.messages.map((m) => (m.id === aiMsgId ? { ...m, text: next } : m)),
        lastPreview: previewText,
      }));
      if (idx >= fullText.length) {
        stopStream();
      }
    }, 45);
  };
  const sendToSession = ({ text, files = [], sessionId = null }) => {
    const q = text.trim();
    if (!q && !files.length) return;
    const sid = sessionId || activeSessionId || `s_${Date.now()}`;
    const uid = `u_${Date.now()}`;
    const aid = `a_${Date.now()}`;
    const t = nowLabel();
    const attached = files.map((f) => ({
      id: `${f.name}_${f.size}_${Date.now()}`,
      name: f.name,
      size: f.size,
      type: f.type,
      kind: inferKind(f),
    }));
    setSessions((prev) => {
      const found = prev.find((s) => s.id === sid);
      const base = found
        ? prev
        : [
            {
              id: sid,
              title: q.slice(0, 20) || '新会话',
              lastPreview: q.slice(0, 30) || '新建会话',
              updatedAt: Date.now(),
              messages: [],
            },
            ...prev,
          ];
      return base.map((s) => {
        if (s.id !== sid) return s;
        return {
          ...s,
          title: s.messages.length ? s.title : q.slice(0, 20) || '新会话',
          lastPreview: q.slice(0, 30) || s.lastPreview,
          updatedAt: Date.now(),
          messages: [
            ...s.messages,
            { id: uid, role: 'user', text: q, time: t, attachments: attached },
            { id: aid, role: 'ai', text: '', time: t },
          ],
        };
      });
    });
    setActiveSessionId(sid);
    chatModal.show();
    doStream({
      sessionId: sid,
      aiMsgId: aid,
      fullText: buildAiText(q, attached),
      previewText: '已生成运营洞察',
    });
  };
  const askAI = (q = aiQuery) => {
    const text = q.trim();
    if (!text || isStreaming) return;
    sendToSession({ text, files: [] });
    setAiQ('');
  };
  const sendComposer = () => {
    const sid = activeSessionId || null;
    if (isStreaming) return;
    sendToSession({ text: composerText, files: composerFiles, sessionId: sid });
    setComposerText('');
    setComposerFiles([]);
    setSlashOpen(false);
  };
  const pickFiles = (fileList) => {
    const max = 10 * 1024 * 1024;
    const all = Array.from(fileList || []);
    const passed = [];
    all.forEach((f) => {
      if (f.size > max) {
        toast.show(`附件 ${f.name} 超过 10MB，已跳过`, 'warn');
      } else {
        passed.push(f);
      }
    });
    setComposerFiles((prev) => [...prev, ...passed]);
  };
  const removeFile = (idx) => {
    setComposerFiles((prev) => prev.filter((_, i) => i !== idx));
  };
  const onComposerChange = (v) => {
    setComposerText(v);
    if (v.startsWith('/')) {
      setSlashOpen(true);
      setSlashKeyword(v.slice(1).trim().toLowerCase());
      setSlashSelected(0);
    } else {
      setSlashOpen(false);
      setSlashKeyword('');
    }
  };
  const slashList = slashCommands.filter(
    (c) =>
      !slashKeyword ||
      c.cmd.toLowerCase().includes(slashKeyword) ||
      c.label.toLowerCase().includes(slashKeyword),
  );
  const activeSession = getActiveSession();
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
  useEffect(() => {
    if (!chatModal.open) return;
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chatModal.open, activeSessionId, sessions]);
  useEffect(() => () => stopStream(), []);

  return (
    <>
      <Card
        pad={24}
        style={{ background: `linear-gradient(160deg,#FFFFFF 50%,${D.brandPale} 150%)` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <p
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: D.t1,
                margin: 0,
                letterSpacing: '-0.5px',
              }}>
              向 AI 询问今日运营情况
            </p>
            <p style={{ fontSize: 13, color: D.t3, marginTop: 6 }}>
              发送后在对话弹框中查看流式分析、附件与历史会话
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.35fr .85fr', gap: 12 }}>
            <div
              style={{
                border: `1.5px solid ${aiLoad ? D.brand : D.border}`,
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'border-color .2s',
                background: D.bgCard,
                boxShadow: aiLoad ? `0 0 0 3px ${D.brandPale}` : D.s0,
              }}>
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                placeholder='输入运营问题，按 Enter 发送并在弹框中查看流式分析'
                rows={3}
                style={{
                  width: '100%',
                  border: 'none',
                  padding: '13px 14px',
                  fontSize: 13,
                  color: D.t2,
                  resize: 'none',
                  outline: 'none',
                  lineHeight: 1.7,
                  background: 'transparent',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderTop: `1px solid ${D.divider}`,
                  background: D.bgSub,
                }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {quickPrompts.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAiQ(q);
                        askAI(q);
                      }}
                      style={{
                        padding: '3px 10px',
                        borderRadius: 20,
                        border: `1px solid ${D.border}`,
                        background: D.bgCard,
                        color: D.t3,
                        fontSize: 11,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all .13s',
                      }}>
                      {q}
                    </button>
                  ))}
                </div>
                <Btn
                  v='primary'
                  sz='sm'
                  onClick={() => askAI()}
                  disabled={!aiQuery.trim() || isStreaming}>
                  {aiLoad ? (
                    <>
                      <RefreshCcw size={11} style={{ animation: 'spin .8s linear infinite' }} />
                      分析中
                    </>
                  ) : (
                    <>
                      <Send size={11} />
                      发送
                    </>
                  )}
                </Btn>
              </div>
            </div>
            <div
              style={{
                border: `1px solid ${D.border}`,
                borderRadius: 10,
                background: D.bgCard,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <MessageSquare size={14} color={D.brand} />
                  <span style={{ fontSize: 12, color: D.t2, fontWeight: 600 }}>最近会话</span>
                </div>
                {sortedSessions.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      chatModal.show();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      border: `1px solid ${D.border}`,
                      background: D.bgSub,
                      borderRadius: 8,
                      padding: '8px 10px',
                      marginBottom: 6,
                      cursor: 'pointer',
                    }}>
                    <div style={{ fontSize: 12, color: D.t2, fontWeight: 600, marginBottom: 2 }}>
                      {s.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: D.t4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                      {s.lastPreview}
                    </div>
                  </button>
                ))}
                {!sortedSessions.length && (
                  <div style={{ fontSize: 12, color: D.t4 }}>暂无历史会话</div>
                )}
              </div>
              <Btn v='sub' sz='sm' onClick={() => chatModal.show()}>
                <Bot size={12} />
                打开会话窗口
              </Btn>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        open={chatModal.open}
        onClose={() => {
          stopStream();
          chatModal.hide();
        }}
        title={modalTitle}
        width={960}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14, minHeight: 520 }}>
          <div
            style={{
              border: `1px solid ${D.border}`,
              borderRadius: 10,
              background: D.bgSub,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <div style={{ padding: 10, borderBottom: `1px solid ${D.divider}` }}>
              <Btn
                v='sub'
                sz='sm'
                onClick={() => {
                  setActiveSessionId(null);
                  setComposerText('');
                  setComposerFiles([]);
                }}>
                <Plus size={12} />
                新会话
              </Btn>
            </div>
            <div
              style={{
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                overflowY: 'auto',
              }}>
              {sortedSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  style={{
                    textAlign: 'left',
                    border: `1px solid ${s.id === activeSessionId ? D.brandEdge : D.border}`,
                    background: s.id === activeSessionId ? D.brandPale : D.bgCard,
                    borderRadius: 9,
                    padding: '9px 10px',
                    cursor: 'pointer',
                  }}>
                  <div style={{ fontSize: 12, color: D.t2, fontWeight: 600, marginBottom: 3 }}>
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: D.t4,
                      marginBottom: 3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                    {s.lastPreview}
                  </div>
                  <div style={{ fontSize: 10, color: D.t5 }}>
                    {new Date(s.updatedAt).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </button>
              ))}
              {!sortedSessions.length && (
                <div style={{ padding: 12, fontSize: 12, color: D.t4, textAlign: 'center' }}>
                  暂无会话记录
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${D.border}`,
              borderRadius: 10,
              background: D.bgCard,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}>
            <div style={{ padding: '10px 12px', borderBottom: `1px solid ${D.divider}` }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, color: D.t2, fontWeight: 600 }}>
                  {activeSession ? activeSession.title : '新会话'}
                </div>
                {isStreaming && (
                  <span
                    style={{
                      fontSize: 11,
                      color: D.brand,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    <RefreshCcw size={11} style={{ animation: 'spin .8s linear infinite' }} />
                    流式生成中
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
              {(activeSession?.messages || []).map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    border: `1px solid ${m.role === 'user' ? D.brandEdge : D.border}`,
                    background: m.role === 'user' ? D.brandPale : D.bgSub,
                    borderRadius: 10,
                    padding: '10px 12px',
                  }}>
                  <div
                    style={{ fontSize: 12, color: D.t2, lineHeight: 1.72, whiteSpace: 'pre-line' }}>
                    {m.text || '...'}
                  </div>
                  {!!m.attachments?.length && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                      {m.attachments.map((f) => (
                        <span
                          key={f.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 10,
                            color: D.t3,
                            border: `1px solid ${D.border}`,
                            borderRadius: 99,
                            padding: '2px 8px',
                            background: D.bgCard,
                          }}>
                          {f.kind === 'image' ? (
                            <Image size={11} />
                          ) : f.kind === 'video' ? (
                            <Play size={11} />
                          ) : (
                            <Paperclip size={11} />
                          )}
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 6, fontSize: 10, color: D.t5 }}>{m.time}</div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <div style={{ borderTop: `1px solid ${D.divider}`, padding: 10, position: 'relative' }}>
              {!!composerFiles.length && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {composerFiles.map((f, i) => (
                    <span
                      key={`${f.name}_${f.size}_${i}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        border: `1px solid ${D.border}`,
                        borderRadius: 99,
                        fontSize: 11,
                        color: D.t3,
                        padding: '3px 8px',
                        background: D.bgSub,
                      }}>
                      {inferKind(f) === 'image' ? (
                        <Image size={11} />
                      ) : inferKind(f) === 'video' ? (
                        <Play size={11} />
                      ) : (
                        <Paperclip size={11} />
                      )}
                      {f.name} · {fmtSize(f.size)}
                      <button
                        onClick={() => removeFile(i)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          display: 'inline-flex',
                          cursor: 'pointer',
                        }}>
                        <X size={11} color={D.t4} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <textarea
                value={composerText}
                onChange={(e) => onComposerChange(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    slashOpen &&
                    slashList.length &&
                    (e.key === 'ArrowDown' || e.key === 'ArrowUp')
                  ) {
                    e.preventDefault();
                    setSlashSelected((p) => {
                      if (e.key === 'ArrowDown') return (p + 1) % slashList.length;
                      return (p - 1 + slashList.length) % slashList.length;
                    });
                    return;
                  }
                  if (slashOpen && slashList.length && e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    applySlash(slashList[slashSelected] || slashList[0]);
                    return;
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendComposer();
                  }
                }}
                rows={3}
                placeholder='输入消息，使用 / 触发常用指令'
                style={{
                  width: '100%',
                  border: `1px solid ${D.border}`,
                  borderRadius: 9,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: D.t2,
                  resize: 'none',
                  outline: 'none',
                  lineHeight: 1.7,
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              {slashOpen && !!slashList.length && (
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    right: 10,
                    bottom: 96,
                    border: `1px solid ${D.border}`,
                    background: D.bgCard,
                    borderRadius: 10,
                    boxShadow: D.s2,
                    padding: 6,
                    zIndex: 5,
                  }}>
                  {slashList.map((c, i) => (
                    <button
                      key={c.cmd}
                      onClick={() => applySlash(c)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        border: 'none',
                        background: i === slashSelected ? D.brandPale : 'transparent',
                        padding: '8px 10px',
                        borderRadius: 7,
                        cursor: 'pointer',
                      }}>
                      <div style={{ fontSize: 12, color: D.t2, fontWeight: 600 }}>
                        {c.cmd} · {c.label}
                      </div>
                      <div style={{ fontSize: 11, color: D.t4, marginTop: 2 }}>{c.prompt}</div>
                    </button>
                  ))}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => imgInputRef.current?.click()}
                    style={{
                      border: `1px solid ${D.border}`,
                      background: D.bgSub,
                      color: D.t3,
                      borderRadius: 8,
                      padding: '5px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}>
                    <Image size={12} />
                    图片
                  </button>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    style={{
                      border: `1px solid ${D.border}`,
                      background: D.bgSub,
                      color: D.t3,
                      borderRadius: 8,
                      padding: '5px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}>
                    <Play size={12} />
                    视频
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `1px solid ${D.border}`,
                      background: D.bgSub,
                      color: D.t3,
                      borderRadius: 8,
                      padding: '5px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}>
                    <Paperclip size={12} />
                    附件
                  </button>
                  <input
                    ref={imgInputRef}
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => pickFiles(e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <input
                    ref={videoInputRef}
                    type='file'
                    accept='video/*'
                    multiple
                    onChange={(e) => pickFiles(e.target.files)}
                    style={{ display: 'none' }}
                  />
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    onChange={(e) => pickFiles(e.target.files)}
                    style={{ display: 'none' }}
                  />
                </div>
                <Btn
                  v='primary'
                  sz='sm'
                  onClick={sendComposer}
                  disabled={(!composerText.trim() && !composerFiles.length) || isStreaming}>
                  {isStreaming ? (
                    <>
                      <RefreshCcw size={11} style={{ animation: 'spin .8s linear infinite' }} />
                      生成中
                    </>
                  ) : (
                    <>
                      <Send size={11} />
                      发送
                    </>
                  )}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
