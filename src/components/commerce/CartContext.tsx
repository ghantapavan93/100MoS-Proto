"use client"

import * as React from "react"

export type CartItem = {
    id: string
    name: string
    price: number
    image: string
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    isCartOpen: boolean
    isMenuOpen: boolean
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (id: string) => void
    setCartOpen: (open: boolean) => void
    setMenuOpen: (open: boolean) => void
    count: number
    total: number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = React.useState<CartItem[]>([])
    const [isCartOpen, setCartOpen] = React.useState(false)
    const [isMenuOpen, setMenuOpen] = React.useState(false)

    const addItem = (newItem: Omit<CartItem, "quantity">) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id)
            if (existing) {
                return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...newItem, quantity: 1 }]
        })
        setCartOpen(true)
    }

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }

    const count = items.reduce((acc, curr) => acc + curr.quantity, 0)
    const total = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)

    return (
        <CartContext.Provider value={{
            items,
            isCartOpen,
            isMenuOpen,
            addItem,
            removeItem,
            setCartOpen,
            setMenuOpen,
            count,
            total
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = React.useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
