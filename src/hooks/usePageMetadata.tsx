import { useEffect, useContext, createContext, useState, ReactNode } from 'react';

interface PageContextType {
    title: string;
    description: string;
    setPageMetadata: (title: string, description?: string) => void;
}

export const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState<string>('Dashboard');
    const [description, setDescription] = useState<string>('');

    const setPageMetadata = (newTitle: string, newDescription?: string) => {
        setTitle(newTitle);
        setDescription(newDescription || '');
    };

    return (
        <PageContext.Provider value={{ title, description, setPageMetadata }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePage = () => {
    const context = useContext(PageContext);
    if (context === undefined) {
        throw new Error('usePage must be used within a PageProvider');
    }
    return context;
};
export const usePageMetadata = (title: string, description?: string) => {
    const context = useContext(PageContext);
    const setPageMetadata = context?.setPageMetadata;

    useEffect(() => {
        if (!setPageMetadata) return;

        setPageMetadata(title, description);

        return () => {
            setPageMetadata('Dashboard');
        };
    }, [title, description, setPageMetadata]);
};