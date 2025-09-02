// render this as the page then test to see if writing and dragging works.
import interact from 'interactjs'
import { useRef, useEffect } from 'react';
import imageSample from '../assets/images/NUSpace_blue.png'

export default function DraggableSandbox({ onUpdate }) {

    const position = { x: 0, y: 0 }
    const boxRef = useRef(null);

    useEffect(() => {
        if (!boxRef.current) return;

        interact(boxRef.current)
            .draggable({
                listeners: {
                    move(event) {
                        const target = event.target;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);

                        onUpdate?.({ x, y, width: target.offsetWidth, height: target.offsetHeight });
                    }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        const target = event.target;
                        let x = parseFloat(target.getAttribute('data-x')) || 0;
                        let y = parseFloat(target.getAttribute('data-y')) || 0;

                        // update the element's style
                        target.style.width = `${event.rect.width}px`;
                        target.style.height = `${event.rect.height}px`;

                        // translate when resizing from top/left
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);

                        onUpdate?.({ x, y, width: event.rect.width, height: event.rect.height });
                    }
                }
            });

        // Cleanup
        return () => {
            if (boxRef.current) interact(boxRef.current).unset();
        };
    }, []);

    return (
        <div
            ref={boxRef}
            className="hover:border-2 hover:border-dashed hover:border-red-500 cursor-move rounded"
            style={{ width: '100px', height: '100px', background: '', position: 'absolute', top: 200, left: 100, zIndex: 500 }}>
            <img
                className="draggable resizable"
                src={imageSample}
                alt="ChatGPT"
            />

        </div>
    );
}
