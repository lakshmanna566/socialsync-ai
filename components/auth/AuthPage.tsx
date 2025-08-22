
import React, { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Send } from 'lucide-react';

export const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col justify-center items-center p-4">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-600 p-3 rounded-lg">
                    <Send className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Social Poster <span className="text-indigo-400">Magic</span>
                </h1>
            </div>

            <div className="w-full max-w-md bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-2xl p-8 animate-fade-in">
                {isLoginView ? <SignInForm /> : <SignUpForm />}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                        {isLoginView
                            ? "Don't have an account? Sign Up"
                            : 'Already have an account? Sign In'}
                    </button>
                </div>
            </div>
            <p className="text-xs text-gray-600 mt-8">
                Note: This is a demo application. User data is stored in your browser's local storage.
            </p>
        </div>
    );
};
