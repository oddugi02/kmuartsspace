"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, UserRoundPlus, LogIn, Eye, EyeOff } from "lucide-react";

export default function AuthModal() {
  const { closeAuthModal, login, signUp } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let error;
    if (isLoginTab) {
      error = login(email, password);
    } else {
      if (password !== passwordConfirm) {
        setErrorMsg("비밀번호가 일치하지 않습니다.");
        return;
      }
      error = signUp(email, name, password);
    }

    if (error) {
      setErrorMsg(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex bg-gray-50 border-b border-gray-100">
          <button 
            onClick={() => { setIsLoginTab(true); setErrorMsg(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${isLoginTab ? "text-blue-600 border-b-2 border-blue-600 bg-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            로그인
          </button>
          <button 
            onClick={() => { setIsLoginTab(false); setErrorMsg(null); }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLoginTab ? "text-blue-600 border-b-2 border-blue-600 bg-white" : "text-gray-400 hover:text-gray-600"}`}
          >
            회원가입
          </button>
        </div>

        <button 
          onClick={closeAuthModal} 
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {isLoginTab ? "환영합니다!" : "계정 만들기"}
            </h2>
            <p className="text-xs text-gray-500">
              {isLoginTab 
                ? "로그인하고 나만의 장소들을 북마크해보세요." 
                : "가입하고 더 많은 기능을 경험해보세요."}
            </p>
          </div>

          <div className="space-y-4">
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">닉네임</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 아티스트홍"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required={!isLoginTab}
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">이메일 (아이디)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@design.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">비밀번호</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="비밀번호 표시 토글"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">비밀번호 확인</label>
                <div className="relative">
                  <input 
                    type={showPasswordConfirm ? "text" : "password"} 
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    required={!isLoginTab}
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="비밀번호 확인 표시 토글"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
              🚨 {errorMsg}
            </div>
          )}

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl mt-6 transition-colors shadow-sm shadow-blue-500/20"
          >
            {isLoginTab ? (
              <><LogIn className="w-4 h-4" /> 로그인</>
            ) : (
              <><UserRoundPlus className="w-4 h-4" /> 가입 완료</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
