import { EAbstractControl } from "./EAbstractControl";
import { EArray } from "./EArray";


export class EGroup extends EAbstractControl {
    controls: {
        [key: string]: EAbstractControl;
    } = {};

    // eGroup 并不会把所有的 prop 制造处理, 比如 foreignResource, 但是可能我们需要到反射, 比如 foreignKey 需要 foreignResource 的标签
    // 所以就简单的方法就是保留整个 resource, 那么就可以通过 $parent.resource 反射出所有的 prop 了
    resource: any

    get(pathString: string) {
        // 抄袭 ng 的 
        let path: (string | number)[] = pathString.split('.');
        return path.reduce((v: EAbstractControl, key) => {
            if (v instanceof EGroup) {
                return v.controls[key] || null;
            }
            else if (v instanceof EArray) {
                return v.controls[key as number] || null;
            }
            else {
                return null;
            }
        }, this);
    }
}