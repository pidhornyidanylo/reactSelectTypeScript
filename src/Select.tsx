import { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

export type SelectOption = {
    label: string
    value: string | number
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)


export function Select({ multiple, value, onChange, options }: SelectProps) {

    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ highlightedIndex, setHighlightedIndex ] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null)

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined) 
    }

    const selectOption = (option: SelectOption) => {
        if(multiple) {
            if(value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            if(option !== value) onChange(option)
        }
    }

    const isOptionSelected = (option: SelectOption) => {
        return multiple ? value.includes(option) : option === value;
    }

    useEffect(() => {
        setHighlightedIndex(0)
    }, [isOpen])

    return (
        <div ref={containerRef} onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(!isOpen)} tabIndex={0} className={styles.container}>
            <span className={styles.value}>{multiple ? value.map(v => (
                <button key={v.value} onClick={e => {
                    e.stopPropagation();
                    selectOption(v);
                }}
                className={styles['option-badge']}
                >{v.label}
                <span className={styles['remove-btn']}>&times;</span></button>
            )) : value?.label}</span>
            <button 
                onClick={e => {
                    e.stopPropagation()
                    clearOptions()
            }} className={styles['clear-btn']}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen && styles.show}`}>
                {options.map((opt, index) => (
                    <li onClick={e => {
                        e.stopPropagation();
                        selectOption(opt);
                        setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    key={opt.value} 
                    className={`${styles.option} 
                    ${isOptionSelected(opt) ? styles.selected : ''} 
                    ${index === highlightedIndex ? styles.highlighted : ''}`}
                    >{opt.label}</li>
                ))}
            </ul>
        </div>
    )
}   