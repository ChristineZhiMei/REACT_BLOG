import './index.css'
import { JSX , useRef , useEffect} from 'react'
import { gsap } from 'gsap'
// 磁力吸附小球画svg类
type ExtendedSVGElement = SVGElement & {
    line: SVGLineElement;
    ori_x: number;
    ori_y: number
    mX: number;
    mY: number;
    animater: gsap.core.Timeline,
}
class Magnetic {
    // 画布尺寸
    protected containerSize: { width: number; height: number } = {
        width : 0,
        height : 0
    }
    // 画布的左上角位置，用于计算鼠标相对位置
    protected containerPosition: { left: number; top: number } = {
        left : 0,
        top : 0
    }
    // 小球大小
    protected ballsSize:number = 15
    // 处于鼠标半径范围内的小球对象数组
    protected balls: ExtendedSVGElement[] = []
    // 构造类传入参数：小球行列数量，小球大小，鼠标吸附圆半径
    constructor(
        // 小球行列数量
        protected ballsNumber:{lines:number,rows:number},
        // 鼠标吸附圆半径
        protected mouse_radius: number,
        //容器对象
        protected container: HTMLElement | null,
        //旋转角度
        protected rotate:number
    ){}
    // 获取画布实际尺寸，实际坐标位置，并赋值
    resize():void{
        if(this.container){
            const rect:DOMRect = this.container.getBoundingClientRect()
            this.containerSize.width = rect.width
            this.containerSize.height = rect.height
            this.containerPosition.left = rect.left
            this.containerPosition.top = rect.top
            this.ballsSize = this.containerSize.width / this.ballsNumber.lines / 2
        }
    }

    // 生成小球
    createBalls():void {
        // 遍历列
        for (let r: number = 1; r < this.ballsNumber.rows; r++){
            for (let li: number = 1; li < this.ballsNumber.lines; li++) { // 遍历行
                const svgURL: string = 'http://www.w3.org/2000/svg'
                // 单个小球坐标x,y
                const midPoint: [number, number] = [this.containerSize.width / 2, this.containerSize.height / 2]
                // console.log(this.containerPosition.top, this.containerPosition.left)
                const spaceX: number = this.containerSize.width / this.ballsNumber.lines
                const spaceY: number = this.containerSize.height / this.ballsNumber.lines
                const listXY: [number, number] = this.rotatePointAroundAnotherPoint(midPoint, [spaceX * li, spaceY * r], this.rotate)
                const x: number = listXY[0]
                const y: number = listXY[1]
                // 系数1
                const coefficientR: number = this.calculateQuadraticY(r / this.ballsNumber.rows,0.77)
                // 系数2
                const coefficient:number = this.calculateQuadraticY(li / this.ballsNumber.lines,0.77) + coefficientR
                // const coefficient:number = this.calculateQuarticY(li / this.ballsNumber.lines,0.8,coefficientR)
                if (coefficient < 0.3) {
                    continue
                }
                const rSize: number = coefficient * this.ballsSize
                //为小球添加属性颜色，位置，大小
                const ball: ExtendedSVGElement = document.createElementNS(svgURL, 'circle') as ExtendedSVGElement
                ball.setAttribute('fill', 'var(--dark-mode-rearview,#fff)')
                ball.setAttribute("cx", x.toString())
                ball.setAttribute("cy", y.toString())
                ball.setAttribute("r", rSize.toString())
                //添加固定点，并为固定点添加属性，颜色，位置，大小
                const point: Element = document.createElementNS(svgURL, 'circle')
                point.setAttribute('fill', '#EA9B9BFF')
                point.setAttribute("cx", x.toString())
                point.setAttribute("cy", y.toString())
                point.setAttribute("r", (rSize / 5).toString())
                //添加小球和固定点的连线，并为连线添加属性，颜色，位置，大小
                const line: SVGLineElement = document.createElementNS("http://www.w3.org/2000/svg", "line")
                line.setAttribute("x1", String(x));
                line.setAttribute("y1", String(y));
                line.setAttribute("x2", String(x));
                line.setAttribute("y2", String(y));
                // 将小球，固定点，连线添加到画布中
                if (this.container) {
                    this.container.appendChild(line)
                    this.container.appendChild(point);
                    this.container.appendChild(ball);
                }
                ball.line = line
                ball.ori_x = x
                ball.ori_y = y
                this.balls.push(ball)
            }
        }
    }
    // 小球移动
    move_balls(mouseX:number, mouseY:number):void{
        // 循环遍历小球数组，判断小球是否处于鼠标半径范围内，如果是则将小球移动到鼠标位置
        this.balls.forEach(ball => {
            // 计算鼠标相对位置
            const mX:number = mouseX - this.containerPosition.left
            const mY:number = mouseY - this.containerPosition.top
            // 计算小球相对位置
            const dX:number = ball.ori_x - mX
            const dY:number = ball.ori_y - mY
            // 计算小球到鼠标的距离
            const distance:number = Math.sqrt(dX ** 2 + dY ** 2)
            // 如果小球到鼠标的距离小于鼠标半径，则将小球移动到鼠标位置
            if(distance <= this.mouse_radius){
                // 计算小球移动的距离
                ball.mX = mX + dX / distance * this.mouse_radius
                ball.mY = mY + dY / distance * this.mouse_radius
                // 清除小球动画
                if(ball.animater) ball.animater.kill()
                // 小球动画
                ball.animater = gsap.timeline()
                    // 小球0.5秒内移动到鼠标位置，然后回到原来的位置
                    .to(ball,{
                        attr:{
                            cx: ball.mX,
                            cy: ball.mY,
                            fill:'#b1919f'
                        },
                        duration: 0.5,
                        ease: "power3.out"
                    })
                    .to(ball.line,{
                        attr:{
                            x2: ball.mX,
                            y2: ball.mY,
                        },
                        duration: 0.5,
                        ease: "power3.out"
                    },"<")
                    .to(ball,{
                        attr:{
                            cx: ball.ori_x,
                            cy: ball.ori_y,
                            fill:'var(--dark-mode-rearview,#fff)'
                        },
                        duration: 1,
                        ease: "power3.out"
                    },"<0.1")
                    .to(ball.line,{
                        attr:{
                            x2: ball.ori_x,
                            y2: ball.ori_y,
                        },
                        duration: 1,
                        ease: "power3.out"
                    },"<")
            }
        })
    }
    rotatePointAroundAnotherPoint(
        centerPoint: [number, number],
        targetPoint: [number, number],
        rotationDegree: number
    ): [number, number] {
        const rotationRadian:number = (rotationDegree * Math.PI) / 180;
        const cosX:number = Math.cos(rotationRadian);
        const sinX:number = -Math.sin(rotationRadian); // 取反sinθ以修正旋转方向

        const relativeX = targetPoint[0] - centerPoint[0];
        const relativeY = targetPoint[1] - centerPoint[1];

        const rotatedRelativeX = relativeX * cosX - relativeY * sinX;
        const rotatedRelativeY = relativeX * sinX + relativeY * cosX;

        const newX = rotatedRelativeX + centerPoint[0];
        const newY = rotatedRelativeY + centerPoint[1];

        return [newX, newY];
    }
    calculateQuadraticY(x: number, givenY: number): number {
        return (-4 * givenY) * x * x + (4 * givenY) * x - 0.2;
    }

    // 执行
    init():void{
        this.resize()
        this.createBalls()
        document.addEventListener("mousemove",(e:MouseEvent)=>{
            this.move_balls(e.x,e.y);
        })
    }
}


const PointBalls = (): JSX.Element => {
    const ballsNumber: {
        lines: number,
        rows: number
    } = {
        lines: 18,
        rows: 18,
    }
    const mouse_radius: number = 100
    const container= useRef(null)
    const svgMaRef = useRef<Magnetic | null>(null);
    useEffect(() => {
        if (container.current) {
            const svgMa = new Magnetic(ballsNumber, mouse_radius, container.current, 30);
            svgMaRef.current = svgMa;
            svgMa.init();
        }

        // 清理函数，在组件卸载时执行
        return () => {
            if (svgMaRef.current) {
                // 移除 mousemove 事件监听器
                document.removeEventListener("mousemove", (e: MouseEvent) => {
                    svgMaRef.current?.move_balls(e.x, e.y);
                });
            }
        };
    }, []);
    return(
        <div className="h-5/6 aspect-1-1">
            <svg className="container relative w-[100%] h-[100%] overflow-visible " ref={container}></svg>
        </div>
    );
}
export default PointBalls