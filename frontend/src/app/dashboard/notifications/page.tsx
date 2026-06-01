"use client";

import { motion } from "framer-motion";
import { Bell, ShieldCheck, Mail, Wallet, Trash2, Eye } from "lucide-react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

export default function NotificationsCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSkyLuxeStore();

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  return (
    <div className="space-y-8 flex-1 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Notifications Center</h1>
          <p className="text-platinum/50 font-light text-sm">Monitor private session logins, flight FBO dispatch events, and credit transactions.</p>
        </div>
        {notifications.some(n => n.unread) && (
          <button 
            onClick={handleMarkAllRead}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-xs font-mono uppercase"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const isUnread = notif.unread;
            const Icon = notif.type === "security" ? ShieldCheck : notif.type === "flight" ? Bell : Wallet;
            
            return (
              <div 
                key={notif.id} 
                className={`p-6 flex items-start gap-4 transition-colors ${isUnread ? 'bg-gold/[0.02]' : 'hover:bg-white/[0.01]'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                  isUnread ? 'bg-gold/10 text-gold border-gold/30' : 'bg-white/5 text-platinum/50 border-white/5'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm font-medium ${isUnread ? 'text-white font-semibold' : 'text-platinum/80'}`}>{notif.title}</p>
                    <span className="text-[10px] text-platinum/40 font-mono shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-platinum/50 mt-1 leading-relaxed">{notif.message}</p>
                  
                  {isUnread && (
                    <button 
                      onClick={() => handleMarkRead(notif.id)}
                      className="text-gold text-[10px] font-bold uppercase tracking-widest mt-3 flex items-center gap-1 hover:underline font-mono"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-platinum/40 font-light">No notifications logged in the current session.</div>
        )}
      </div>
    </div>
  );
}
