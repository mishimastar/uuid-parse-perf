(module
    ;; Declare linear memory with initial size of 1 page (64 KiB) and maximal
    ;; size of 100 pages, and export it to host.
    (memory (export "memory") 1 100)

    ;; (global $zero i64 (i64.const 48))
    ;; (global $nine i64 (i64.const 58))
    ;; (global $alow i64 (i64.const 87))

    (func (export "fillmem") (param $offset i32) (param $val i32)
        (i32.store8 (local.get $offset) (local.get $val))
    )

    (func (export "write32") (param $offset i32) (param $val i32)
        (i32.store (local.get $offset) (local.get $val))
    )
    (func (export "write64") (param $offset i32) (param $val i64)
        (i64.store (local.get $offset) (local.get $val))
    )

    (func (export "write32parsed64") (param $offset i32) (param $val i32)
        (i64.store (local.get $offset) (call $parse16char (i64.extend_i32_s(local.get $val))))
    )

    (func (export "read32") (param $offset i32) (result i32)
        (i32.load (local.get $offset))
    )

    (func (export "read64") (param $offset i32) (result i64)
        (i64.load (local.get $offset))
    )

    (func $calcHex (export "calcHex") (result i64)

        (i64.load (i32.const 120))
        (i64.shl (i64.const 4))
        (i64.load (i32.const 128))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 136))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 72))
        (i64.add)
        
        
        (i64.shl (i64.const 4))
        (i64.load (i32.const 80))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 88))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 96))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 0))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 8))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 16))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 24))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 32))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 40))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 48))
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load (i32.const 56))
        (i64.add)
    )


    ;; Initialize 8 bytes, starting at offset 0x20.
    ;; (data (i32.const 0x020) "\31\65\65\31\36\38\32\65\63\65\33\33\66\65\34")
    (data (i32.const 0x00) "\65\63\65\33\33\66\65\34\2D\31\36\38\32\2D\31\31\65\65")

    (func $orientate (export "orientate") (local $size i32 ) (local $source i32 ) (local $dest i32 )
        (local.set $size (i32.const 3))
        (local.set $source (i32.const 15))
        (local.set $dest (i32.const 32))
        (memory.copy (local.get $dest) (local.get $source) (local.get $size))
        (local.set $size (i32.const 4))
        (local.set $source (i32.const 9))
        (local.set $dest (i32.const 35))
        (memory.copy (local.get $dest) (local.get $source) (local.get $size))
        (local.set $size (i32.const 8))
        (local.set $source (i32.const 0))
        (local.set $dest (i32.const 39))
        (memory.copy (local.get $dest) (local.get $source) (local.get $size))
    )

        (func $orientate2 (export "orientate2") 
        (i32.store8 (i32.const 48) (i32.load8_u (i32.const 15)))
        (i32.store8 (i32.const 49) (i32.load8_u (i32.const 16)))
        (i32.store8 (i32.const 50) (i32.load8_u (i32.const 17)))
        (i32.store8 (i32.const 51) (i32.load8_u (i32.const 9)))
        (i32.store8 (i32.const 52) (i32.load8_u (i32.const 10)))
        (i32.store8 (i32.const 53) (i32.load8_u (i32.const 11)))
        (i32.store8 (i32.const 54) (i32.load8_u (i32.const 12)))
        (i32.store8 (i32.const 55) (i32.load8_u (i32.const 0)))
        (i32.store8 (i32.const 56) (i32.load8_u (i32.const 1)))
        (i32.store8 (i32.const 57) (i32.load8_u (i32.const 2)))
        (i32.store8 (i32.const 58) (i32.load8_u (i32.const 3)))
        (i32.store8 (i32.const 59) (i32.load8_u (i32.const 4)))
        (i32.store8 (i32.const 60) (i32.load8_u (i32.const 5)))
        (i32.store8 (i32.const 61) (i32.load8_u (i32.const 6)))
        (i32.store8 (i32.const 62) (i32.load8_u (i32.const 7)))
    )

    (func $orientate3 (export "orientate3") 
        (i32.const 64)
        (i32.const 65)
        (i32.const 66)
        (i32.const 67)
        (i32.const 68)
        (i32.const 69)
        (i32.const 70)
        (i32.const 71)
        (i32.const 72)
        (i32.const 73)
        (i32.const 74)
        (i32.const 75)
        (i32.const 76)
        (i32.const 77)
        (i32.const 78)
        (i32.store8 (i32.load8_u (i32.const 7)))
        (i32.store8 (i32.load8_u (i32.const 6)))
        (i32.store8 (i32.load8_u (i32.const 5)))
        (i32.store8 (i32.load8_u (i32.const 4)))
        (i32.store8 (i32.load8_u (i32.const 3)))
        (i32.store8 (i32.load8_u (i32.const 2)))
        (i32.store8 (i32.load8_u (i32.const 1)))
        (i32.store8 (i32.load8_u (i32.const 0)))
        (i32.store8 (i32.load8_u (i32.const 12)))
        (i32.store8 (i32.load8_u (i32.const 11)))
        (i32.store8 (i32.load8_u (i32.const 10)))
        (i32.store8 (i32.load8_u (i32.const 9)))
        (i32.store8 (i32.load8_u (i32.const 17)))
        (i32.store8 (i32.load8_u (i32.const 16)))
        (i32.store8 (i32.load8_u (i32.const 15)))
    )

    (func (export "read_mem") (param $source i32)(result i32) (i32.load8_u (local.get $source)))

    ;; (func $ifexpr (export "isDigitCode") (param $n i32) (result i32)
    ;;     (i32.and 
    ;;         (if (result i32)
    ;;             (i32.ge_u (local.get $n) (i32.const 48))
    ;;             (then (i32.const 1))
    ;;             (else (i32.const 0))
    ;;         )
    ;;         (if (result i32)
    ;;             (i32.le_u (local.get $n) (i32.const 57))
    ;;             (then (i32.const 1))
    ;;             (else (i32.const 0))
    ;;         )
    ;;     )
    ;; )
    
    (func $codeMoreThan9 (export "moreThan57") (param $n i64) (result i32)
        (i32.const 1)
        (i32.const 0)
        (i64.ge_u (local.get $n) (i64.const 58))
        select
        ;; (if (result i32) (then (i32.const 1)) (else (i32.const 0)))
    )
    (func $parseHexM (export "parseHexM")  (result i64) (i64.const 0))
    (func $parseHex (export "parseHex") (param $str i32) (result i64)
    ;; (param $str i32
        ;; (local $str i32)
        (local $index i32)
        (local $digit i64)
        (local $result i64)
        (local $char i64)
        
    
        ;; Initialize the result to 0
        ;; (local.set $str (i32.const 32))
        (local.set $result (i64.const 0))

        ;; Iterate over each character in the string
        (loop
        ;; Load the character at the current index
            (i64.load8_u (i32.add (local.get $str) (local.get $index)))
            (local.set $char)

            (if (result)
            (call $codeMoreThan9 (local.get $char))
            (then
                ;; Convert the character to a digit
                (local.get $char)
                (i64.const 87)
                (i64.sub)
                (local.set $digit)

                ;; Multiply the result by 16 and add the digit
                (local.get $result)
                (i64.const 16)
                (i64.mul)
                (local.get $digit)
                (i64.add)
                (local.set $result)
            )
            (else 
            ;; Convert the character to a digit
                (local.get $char)
                (i64.const 48)
                (i64.sub)
                (local.set $digit)

                ;; Multiply the result by 16 and add the digit
                (local.get $result)
                (i64.const 16)
                (i64.mul)
                (local.get $digit)
                (i64.add)
                (local.set $result)
            
                
            )
            )   

        ;; Increment the index
        (local.get $index)
        (i32.const 1)
        (i32.add)
        (local.set $index)

        ;; Check if the end of the string has been reached
        (i32.load8_u (i32.add (local.get $str) (local.get $index)))
        (i32.const 0)
        (i32.ne)
        (br_if 0)
        )

        (local.get $result)
    )

    (func $parse16char (export "parse16char") (param $char i64) (result i64)
        (i64.sub (local.get $char) (i64.const 87))
        (i64.sub (local.get $char) (i64.const 48))
        (i64.ge_u (local.get $char) (i64.const 58))
        select  
    )

    (func $parseHex2 (export "parseHex2") (result i64)

        (i64.const 0)
        (i64.load8_u (i32.const 15))
        (call $parse16char)
        (i64.add)

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 16))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 17))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 9))
        (call $parse16char)
        (i64.add)
        
        
        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 10))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 11))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 12))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 0))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 1))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 2))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 3))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 4))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 5))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 6))
        (call $parse16char)
        (i64.add)
        

        (i64.shl (i64.const 4))
        (i64.load8_u (i32.const 7))
        (call $parse16char)
        (i64.add)
    )

    

    (func $millis (export "millis") (result i64) (local $result i64)
        (call $orientate)
        (local.set $result (call $parseHex (i32.const 32)))
        (local.get $result)
        (i64.const 10000)
        (i64.div_u)
        (i64.const 12219292800000)
        (i64.sub)
    )

    (func $millis2 (export "millis2") (result i64) (local $result i64)
        (call $orientate2)
        (local.set $result (call $parseHex (i32.const 48)))
        (local.get $result)
        (i64.const 10000)
        (i64.div_u)
        (i64.const 12219292800000)
        (i64.sub)
    )

    (func $millis3 (export "millis3") (result i64) (local $result i64)
        (call $orientate3)
        (local.set $result (call $parseHex (i32.const 64)))
        (local.get $result)
        (i64.const 10000)
        (i64.div_u)
        (i64.const 12219292800000)
        (i64.sub)
    )

    (func $millis10 (export "millis10") (result i64)
        ;; (call $orientate3)
        ;; (local.set $result )
        (call $parseHex2)
        ;; (local.get $result)
        (i64.const 10000)
        (i64.div_u)
        (i64.const 12219292800000)
        (i64.sub)
    )

    (func $millis20 (export "millis20") (result i64)
        (call $calcHex)
        (i64.const 10000)
        (i64.div_u)
        (i64.const 12219292800000)
        (i64.sub)
    )


    ;; (func $millisnoJSMEM (export "millisnoJSMEM") (result i64) (local $result i64)
    ;;     (call $orientate)
    ;;     (local.set $result (call $parseHex))
    ;;     (local.get $result)
    ;;     (i64.const 10000)
    ;;     (i64.div_u)
    ;;     (i64.const 12219292800000)
    ;;     (i64.sub)
    ;; )

)



;; (module
;;     (import "console" "log" (func $log (param i32 i32)))
;;     (import "js" "mem" (memory 1))
;;     (data $dd (i32.const 0) "Hello") 
;;     (func (export "writeHi")(param $length i32)(param $ii i32)(result i32)
;;         i32.const 0  ;; pass offset 0 to log
;;         local.get $length
;;         ;; i32.const 2  ;; pass length 2 to log
;;         call $log
;;         (i32.mul (local.get $length) (local.get $ii))
;;         ;; local.set 1
        
        
;;     )
;; )