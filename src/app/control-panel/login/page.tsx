'use client';

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions";
import "./login.css"; 

export default function ControlPanelLoginPage() {
    const [state, formAction, isPending] = useActionState(loginAdmin, null);

    return (
        <div className="control-panel-login-container">
            <form action={formAction} className="control-panel-login-form">
                <h1 className="control-panel-login-form__title">Войти в Панель Управления</h1>
                
                <div className="control-panel-login-form__field">
                    <label className="control-panel-login-form__label">Логин:</label>
                    <input 
                        type="text" 
                        name="login" 
                        required 
                        className="control-panel-login-form__input"
                        disabled={isPending}
                    />
                </div>

                <div className="control-panel-login-form__field">
                    <label className="control-panel-login-form__label">Пароль:</label>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        className="control-panel-login-form__input"
                        disabled={isPending}
                    />
                </div>

                {state?.error && (
                    <div className="control-panel-login-form__error">
                        {/*⚠️ */} {state.error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="control-panel-login-form__button"
                    disabled={isPending}
                >
                    {isPending ? "Проверка..." : "Войти"}
                </button>
            </form>
        </div>
    );
}