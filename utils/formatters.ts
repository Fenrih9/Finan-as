/**
 * Utilitários de formatação compartilhados
 */

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 */
export const formatMoney = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/**
 * Formata uma data para exibição de hora (HH:mm)
 */
export const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formata uma data para exibição curta (DD/MM)
 */
export const formatDateShort = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

/**
 * Formata uma data completa (DD/MM/YYYY)
 */
export const formatDateFull = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR');
};
