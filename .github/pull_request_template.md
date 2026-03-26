# 🚀 Pull Request

## 📌 Context
**Ticket/Issue:** # (e.g., #12)
**Type:** feature / fix / refactor

## 📝 Summary
(Briefly explain what you changed and why. E.g., "Implemented the Booking Entity with Idempotency rules.")

## 📸 Proof of Work (Frontend) / Architecture (Backend)
- [ ] **Frontend:** Attached screenshots of the UI.
- [ ] **Backend:** I have verified that `Domain` does NOT depend on `Infrastructure`.
- [ ] **Database:** I have updated the migration scripts (if schema changed).

## 🧪 Testing
**How did you test this?**
- [ ] **Unit Tests:** Ran `dotnet test` and all passed.
- [ ] **Manual:** Verified the API endpoint in Swagger.
- [ ] **Integration:** Verified payment callback with Ngrok (if applicable).

## ✅ Checklist
- [ ] My code follows the **Clean Architecture** strict layering.
- [ ] I have performed a self-review of my code.
- [ ] I have commented hard-to-understand areas.
- [ ] I have resolved merge conflicts with `develop`.
