(module
    (import "wasi_snapshot_preview1" "random_get"
        (func $wasi_get_random (param (;pointer;) i32) (param (;len;) i32) (result (;status;) i32))
    )

    (memory (export "memory") 1)
    (global $cntr (mut i32) (i32.const 0))

    (func (export "getRandom") (param $offset i32) (param $len i32) (result i32)
        (call $wasi_get_random (local.get $offset) (local.get $len))
    )

    (func (export "_initialize")
        (call $wasi_get_random (i32.const 0) (i32.const 2047))
        drop
    )

    (func (export "uuidv4") (result i32)
        (global.get $cntr)
        (i32.const 2032)
        (i32.gt_u)
        (if 
            (then 
                (call $wasi_get_random (i32.const 0) (i32.const 2047)) drop
                (global.set $cntr (i32.const 0))
            )
            (else
                (i32.add (global.get $cntr) (i32.const 16)) 
                (global.set $cntr)
            )
        )
        (global.get $cntr)        
    )
)