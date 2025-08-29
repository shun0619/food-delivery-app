import { login } from './actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="w-full max-w-sm relative z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        <Card className="glass shadow-modern-xl border-0 hover:shadow-modern-xl transition-all duration-500 hover:scale-[1.02]">
          <CardHeader className="space-y-6 text-center pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 hover:scale-110 hover:rotate-3 animate-glow group">
              <svg className="w-10 h-10 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent animate-in slide-in-from-top-2 duration-700 delay-300">
                フードデリバリー
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-base animate-in slide-in-from-top-2 duration-700 delay-500">
                美味しい料理をお届けします
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8">
            <form action={login} className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-700">
              <Button 
                type="submit"
                className="w-full h-14 bg-gradient-primary hover:bg-gradient-primary text-white font-semibold text-lg shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-xl border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <svg className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Googleでログイン</span>
                </div>
              </Button>
            </form>
            
            <div className="relative animate-in fade-in-0 duration-700 delay-1000">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="glass px-4 text-slate-500 font-medium rounded-full">または</span>
              </div>
            </div>
            
            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-700 delay-1200">
              <Button 
                variant="outline" 
                className="w-full h-12 glass border-2 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 rounded-xl font-medium group hover:scale-[1.01] hover:shadow-modern"
              >
                <svg className="w-5 h-5 mr-3 text-blue-600 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-slate-700 dark:text-slate-300">Facebookでログイン</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 glass border-2 hover:border-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-300 rounded-xl font-medium group hover:scale-[1.01] hover:shadow-modern"
              >
                <svg className="w-5 h-5 mr-3 text-slate-700 dark:text-slate-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="text-slate-700 dark:text-slate-300">メールでログイン</span>
              </Button>
            </div>
            
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed animate-in fade-in-0 duration-700 delay-1500">
              ログインすることで、
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2 transition-colors duration-200 hover:underline-offset-4">利用規約</a>
              および
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2 transition-colors duration-200 hover:underline-offset-4">プライバシーポリシー</a>
              に同意したものとみなされます
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}