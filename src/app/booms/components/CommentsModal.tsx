"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  videoId,
  videoTitle,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState(0);

  // Comentarios de ejemplo - esto se reemplazará con datos de Supabase
  useEffect(() => {
    if (isOpen) {
      setComments([
        {
          id: '1',
          author: '@usuario1',
          text: '¡Me encanta este video! 🔥',
          timestamp: '2h',
          likes: 12,
        },
        {
          id: '2',
          author: '@usuario2',
          text: 'Increíble contenido, sigue así',
          timestamp: '5h',
          likes: 8,
        },
        {
          id: '3',
          author: '@usuario3',
          text: 'Donde puedo conseguir ese producto?',
          timestamp: '1d',
          likes: 3,
        },
        {
          id: '4',
          author: '@usuario4',
          text: 'Excelente calidad de video y audio',
          timestamp: '2d',
          likes: 15,
        },
        {
          id: '5',
          author: '@usuario5',
          text: 'Me ha servido mucho este contenido, gracias!',
          timestamp: '3d',
          likes: 7,
        },
        {
          id: '6',
          author: '@usuario6',
          text: 'Podrías hacer más videos como este?',
          timestamp: '4d',
          likes: 5,
        },
        {
          id: '7',
          author: '@usuario7',
          text: 'Increíble, ya lo compartí con mis amigos',
          timestamp: '5d',
          likes: 9,
        },
        {
          id: '8',
          author: '@usuario8',
          text: 'La música de fondo está perfecta',
          timestamp: '6d',
          likes: 4,
        },
      ]);
    }
  }, [isOpen, videoId]);

  // Congelar/descongelar la pantalla cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    
    // Simular envío de comentario - reemplazar con llamada a Supabase
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: '@tu_usuario',
        text: replyingTo ? `@${replyingTo} ${newComment}` : newComment,
        timestamp: 'ahora',
        likes: 0,
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setReplyingTo(null);
      setIsLoading(false);
    }, 500);
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    
    // Actualizar el contador de likes
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: likedComments.has(commentId) ? comment.likes - 1 : comment.likes + 1 
          }
        : comment
    ));
  };

  const handleReplyToComment = (author: string) => {
    setReplyingTo(author);
    setNewComment(`@${author} `);
  };

  const handleDragStart = (y: number) => {
    setDragStartY(y);
  };

  const handleDragEnd = (y: number) => {
    const dragDistance = y - dragStartY;
    // Si arrastró hacia abajo más de 100px, cerrar el modal
    if (dragDistance > 100) {
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "15%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 flex flex-col shadow-2xl border-2 border-gray-200"
            style={{ height: "85%", borderRadius: "24px 24px 0 0" }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleDragStart(e.touches[0].clientY);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleDragEnd(e.changedTouches[0].clientY);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header mejorado con diseño más moderno */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-3xl">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3 text-2xl">💬</span>
                  Comentarios
                </h3>
                <p className="text-sm text-gray-600 truncate mt-1 font-medium">{videoTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <X size={24} />
              </button>
            </div>

            {/* Barra de arrastrar mejorada y más moderna */}
            <div className="flex justify-center py-4 bg-gradient-to-b from-gray-50 to-white">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full shadow-sm" />
            </div>

            {/* Lista de comentarios con scroll mejorado y más altura */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 bg-gradient-to-b from-white to-gray-50 max-h-96 min-h-80" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 transparent' }}>
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💭</span>
                  </div>
                  <p className="text-gray-500 text-center font-medium">Sé el primero en comentar</p>
                  <p className="text-gray-400 text-sm text-center">¡Comparte tu opinión sobre este video!</p>
                </div>
              ) : (
                <div className="space-y-6 pt-2">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      {/* Avatar moderno */}
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-sm font-bold text-white">
                          {comment.author.charAt(1).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Contenido del comentario con diseño moderno */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {comment.author}
                          </p>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                        
                        {/* Acciones del comentario con estilo moderno */}
                        <div className="flex items-center space-x-6 mt-2 ml-4">
                          <span className="text-xs text-gray-500 font-medium">
                            {comment.timestamp}
                          </span>
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className={`text-xs transition-all duration-200 flex items-center space-x-1 ${
                              likedComments.has(comment.id) 
                                ? 'text-red-500 font-semibold' 
                                : 'text-gray-500 hover:text-red-400'
                            }`}
                          >
                            <span>{likedComments.has(comment.id) ? '❤️' : '🤍'}</span>
                            <span>{comment.likes}</span>
                          </button>
                          <button 
                            onClick={() => handleReplyToComment(comment.author)}
                            className="text-xs text-gray-500 hover:text-indigo-500 font-medium transition-colors duration-200"
                          >
                            Responder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Espacio para el área de escritura fija */}
            <div className="h-32"></div>
          </motion.div>

          {/* ÁREA DE ESCRITURA - Fija en la parte inferior, independiente del modal */}
          <div className="fixed bottom-6 left-0 right-0 z-50 border-t border-gray-200 p-4 bg-gradient-to-r from-white to-gray-50 shadow-2xl backdrop-blur-sm mx-0">
            {replyingTo && (
              <div className="mb-3 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl text-sm text-blue-700 inline-flex items-center shadow-sm border border-blue-100">
                <span className="mr-2">↳</span>
                Respondiendo a <span className="font-semibold mx-1">{replyingTo}</span>
                <button 
                  onClick={() => {
                    setReplyingTo(null);
                    setNewComment('');
                  }}
                  className="ml-3 text-blue-400 hover:text-blue-600 text-lg transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex items-end space-x-3">
              {/* Avatar del usuario actual más moderno */}
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mb-2 shadow-lg">
                <span className="text-xs font-bold text-white">Tú</span>
              </div>                {/* Input completamente rediseñado */}
                <div className="flex-1 relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={replyingTo ? `Responder a ${replyingTo}...` : "Comenta"}
                    className="w-full px-4 py-3 pr-14 border-2 border-gray-200 rounded-3xl resize-none focus:outline-none focus:ring-3 focus:ring-green-400/50 focus:border-green-400 bg-white hover:bg-gray-50 focus:bg-white transition-all duration-300 text-base placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    disabled={isLoading}
                  />
                  
                  {/* Botón enviar completamente rediseñado */}
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isLoading}
                    className={`absolute right-2 bottom-2 p-2.5 rounded-full transition-all duration-300 ${
                      newComment.trim() && !isLoading
                        ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentsModal;
