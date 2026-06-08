# AI Agent Workflow

## Agent 1 — Workout Coach Agent

```mermaid
sequenceDiagram
    actor User
    participant Frontend as WorkoutCoachPage
    participant Backend as agents.controller
    participant DB as PostgreSQL
    participant Agent as workout-agent.service
    participant Groq as Groq API (optional)

    User->>Frontend: Select equipment & constraints, click "Generate Plan"
    Frontend->>Backend: POST /api/agents/workout-coach<br/>{userId, equipment, constraints}
    Backend->>DB: SELECT * FROM profiles WHERE user_id = ?
    DB-->>Backend: UserProfile row
    Backend->>DB: SELECT * FROM workouts WHERE user_id = ? LIMIT 10
    DB-->>Backend: Recent workout sessions
    Backend->>Agent: generateWorkoutRecommendation(profile, workouts, equipment, constraints)

    alt GROQ_API_KEY is set
        Agent->>Groq: POST /openai/v1/chat/completions<br/>(structured JSON prompt)
        Groq-->>Agent: { warmup, mainWorkout, cooldown, weeklyPlan, tips }
    else No API key (deterministic fallback)
        Agent->>Agent: Select template by goal (weight_loss/weight_gain/maintenance)
        Agent->>Agent: Adjust volume for activity level
        Agent-->>Agent: { warmup, mainWorkout, cooldown, weeklyPlan, tips }
    end

    Agent-->>Backend: WorkoutRecommendation
    Backend->>DB: INSERT INTO agent_logs (user_id, agent_type, request, response)
    Backend-->>Frontend: 200 OK { warmup, mainWorkout, cooldown, weeklyPlan, tips, generatedAt }
    Frontend-->>User: Display structured workout plan
```

## Agent 2 — Nutrition / Progress Agent

```mermaid
sequenceDiagram
    actor User
    participant Frontend as AgentPage
    participant Backend as agents.controller
    participant DB as PostgreSQL
    participant Agent as nutrition-agent.service
    participant Groq as Groq API (optional)

    User->>Frontend: Click "Rulează Analiza Săptămânală"
    Frontend->>Backend: POST /api/agents/nutrition-progress<br/>{userId}
    Backend->>DB: SELECT * FROM profiles WHERE user_id = ?
    DB-->>Backend: UserProfile row
    Backend->>DB: SELECT * FROM progress_entries<br/>WHERE user_id = ? AND date >= NOW() - 14 days
    DB-->>Backend: Weight history (up to 14 days)

    Backend->>Agent: generateNutritionRecommendation(profile, weightHistory)
    Note over Agent: Compute avg weight last 7 days<br/>Compute avg weight prev 7 days<br/>Calculate TDEE (Mifflin-St Jeor)<br/>Determine caloric adjustment

    Agent->>Agent: Apply guardrail: calories ≥ 1200 kcal
    Agent->>Agent: Apply guardrail: adjustment ≤ ±300 kcal

    alt GROQ_API_KEY is set
        Agent->>Groq: POST /openai/v1/chat/completions<br/>(structured JSON prompt with stats)
        Groq-->>Agent: { progressFeedback, mealPlanSummary }
    else No API key (deterministic fallback)
        Agent->>Agent: Build feedback from templates + calculated values
    end

    Agent-->>Backend: NutritionRecommendation { calories, protein, hydration, ... }
    Backend->>DB: INSERT INTO agent_logs
    Backend-->>Frontend: 200 OK NutritionRecommendation
    Frontend-->>User: Display NutritionAgentCard with stats and feedback
```

## Guardrails Summary

| Guardrail | Agent 1 | Agent 2 |
|---|---|---|
| Min caloric recommendation | N/A | ≥ 1200 kcal |
| Max caloric adjustment | N/A | ±300 kcal/week |
| Volume adaptation | Activity level reduces sets | N/A |
| No medical claims | ✅ | ✅ |
| No dangerous terminology | ✅ | ✅ |
| Structured output | ✅ JSON | ✅ JSON |
| Always works without API key | ✅ Deterministic fallback | ✅ Deterministic fallback |
| Agent request logged to DB | ✅ `agent_logs` | ✅ `agent_logs` |
