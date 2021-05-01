
export default function createValidator(validTargets) {
    
    return (function findValidContainer(target) {
        let invalids = 0;
        
        for(
            var p = target;
            invalids < 2;
            p = p.parentElement
            ) {
                if(p === null) return null;
                if(validTargets.includes(p.className)) {
                    return p;
                } else {
                    invalids++
                }
            }
        return null;
    });
}