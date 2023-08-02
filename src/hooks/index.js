import { useState, useRef, useEffect } from 'react'

export const useField = (type) => {
	const [value, setValue] = useState('')

	const onChange = (event) => {
		setValue(event.target.value)
	}

	const reset = () => {
		setValue('')
	}

	return {
		type,
		value,
		onChange,
		reset
	}
}

export const useScroll = () => {
	const htmlElRef = useRef(null)
	const executeScroll = () => htmlElRef.current.scrollIntoView()

	return [executeScroll, htmlElRef]
}

export const useWindowSize = () => {
	const isClient = typeof window === 'object' //Object represents browser window
	const lastWidth = useRef()

	function getSize() {
		return {
			width: isClient ? window.innerWidth : undefined
		}
	}

	const [windowSize, setWindowSize] = useState(getSize)

	useEffect(() => {
		if (!isClient) { return false } //Exit if not user/browser

		function handleResize() {
			if (window?.innerWidth !== lastWidth.current) {
				const width = getSize()
				lastWidth.current = width
				setWindowSize(width)
			}
		}
		window.addEventListener('resize', handleResize) // <-- I am only interested in window.innerWidth !
		return () => window.removeEventListener('resize', handleResize)
		// eslint-disable-next-line
	}, []) // Empty array ensures that effect is only run on mount and unmount

	return windowSize
}
