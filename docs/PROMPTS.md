# 🎯 Prompt Engineering Documentation

Dokumentasi tentang prompt yang dipakai di ResumeIQ. Berguna untuk:
- Iterate prompt agar hasil makin akurat
- Sharing knowledge untuk contributor
- Reference saat debugging output AI yang aneh

## Philosophy

Prompt yang baik untuk analisis resume punya 4 komponen:

1. **Role Definition** — siapa AI ini, dengan ekspertis apa
2. **Task Specification** — apa yang harus dianalisis dan bagaimana
3. **Output Format** — struktur output yang diinginkan (JSON schema)
4. **Constraints** — batasan dan aturan yang harus diikuti

## Main Analysis Prompt

### Struktur

```
[ROLE]
Anda adalah Senior HR Specialist...

[TASK]
Analisis CV terhadap JD...

[CRITERIA]
1. Overall Score
2. ATS Compatibility
3. Keyword Match
4. Section Scores
5. Top Improvements
6. Formatting Issues
7. Strengths

[RULES]
- Specific dan actionable
- Bahasa profesional
- Honest tapi konstruktif

[INPUT]
Resume: ...
JD: ...
```

### Why It Works

**Role-playing** memberikan AI konteks behavior yang diinginkan. Saat kita bilang "Anda HR dengan 15 tahun pengalaman", AI akan generate output dengan tone dan kedalaman seorang expert.

**Structured criteria** memastikan AI tidak skip aspek penting. Tanpa ini, AI cenderung kasih analisis yang shallow.

**Concrete examples** di prompt (before-after) membantu AI memahami format output yang kita mau.

## Iteration History

### V1 (Bad)
```
"Analyze this resume and give feedback"
```
**Hasil:** Generic, tidak konsisten, kadang skip section.

### V2 (Better)
```
"You are an HR expert. Analyze the resume against the JD.
Return JSON with score and feedback."
```
**Hasil:** Lebih terstruktur tapi feedback masih generic.

### V3 (Current)
- Detailed role dengan years of experience
- Step-by-step analysis criteria
- Strict output schema
- Examples untuk format yang diinginkan
- Constraints yang explicit

**Hasil:** Konsisten, specific, actionable.

## Testing Methodology

Test prompt dengan minimal 10 sample CV variatif:

1. **Fresh graduate** dengan zero experience
2. **Mid-level** dengan 3-5 tahun pengalaman
3. **Senior** dengan 10+ tahun pengalaman
4. **Career switcher** (pindah industri)
5. **CV bahasa Indonesia** murni
6. **CV bahasa Inggris** murni
7. **CV mixed language**
8. **CV yang badly formatted** (no structure)
9. **CV yang well-formatted** (use template)
10. **Edge case**: CV 1 halaman vs 3+ halaman

Untuk setiap sample, run prompt dan evaluasi:
- ✅ Apakah JSON valid?
- ✅ Apakah score reasonable?
- ✅ Apakah feedback specific (bukan generic)?
- ✅ Apakah missing keywords akurat?
- ✅ Apakah saran actionable?

## Common Issues & Solutions

### Issue: JSON tidak valid
**Solution:** Pakai `responseMimeType: "application/json"` dan schema strict di Gemini config.

### Issue: Score inconsistent (CV sama, score beda jauh)
**Solution:** Set `temperature: 0.2` untuk konsistensi. Jangan set 0 karena bisa terlalu kaku.

### Issue: Feedback terlalu generic
**Solution:**
- Tambahkan "AVOID generic advice" di constraints
- Berikan contoh konkret di prompt
- Set role dengan ekspertis spesifik

### Issue: AI bias terhadap experience yang panjang
**Solution:** Eksplisit kasih guideline scoring untuk fresh graduate vs senior di prompt.

### Issue: Token usage tinggi
**Solution:**
- Truncate resume ke max 6000 tokens
- Truncate JD ke max 2000 tokens
- Implementasi caching untuk JD yang sama

## Future Improvements

### Few-Shot Examples
Tambahkan 2-3 contoh analisis lengkap di prompt:
```
EXAMPLE 1:
Resume: [sample resume]
JD: [sample JD]
Analysis: [expected output]

EXAMPLE 2: ...
```
Trade-off: Token usage naik signifikan.

### Chain of Thought
Suruh AI "think step by step" sebelum kasih final score:
```
First, identify all keywords from JD.
Then, check each one against the resume.
Finally, calculate overall score.
```
Bisa improve accuracy tapi pakai lebih banyak token.

### Multi-step Analysis
Pecah jadi multiple calls:
1. Extract keywords dari JD
2. Match dengan resume
3. Generate feedback per section
4. Aggregate ke final result

Pros: Lebih akurat. Cons: Lebih lambat & mahal.

### Industry-Specific Prompts
Punya prompt template berbeda untuk:
- Tech (engineering, design)
- Business (sales, marketing)
- Finance (accounting, banking)
- Healthcare
- Creative (writing, art)

Setiap industry punya criteria scoring yang beda.

## Prompt Versioning

Karena prompt = code, kita versioning juga:

```typescript
export const PROMPT_VERSION = "3.2.0";
export const ANALYSIS_PROMPT = { ... };
```

Save prompt version di database bareng analysis result. Berguna untuk:
- A/B testing prompt baru
- Debug kalau ada hasil aneh
- Rollback kalau prompt baru malah lebih buruk

## Tools untuk Iterate

- **Google AI Studio** (https://aistudio.google.com) — playground untuk test prompt
- **PromptLayer** — versioning & analytics untuk prompts
- **LangSmith** — observability untuk LLM apps

## Resources

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Gemini Prompting Best Practices](https://ai.google.dev/docs/prompt_best_practices)
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
