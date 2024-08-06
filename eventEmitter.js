//EventEmitter sınıfını getir
const EventEmitter = require('events');

//EventEmitter sınıfının bir örneğini oluştur
const myEmitter = new EventEmitter();
/*
myEmitter nesnesi üzerinden on() emit() gibi metotları artık kullanabiliriz.
on() metodu bir olay dinleyicisi ekler.Aşağıdaki örneklerin üçünde de 'foo' olayı dinleniyor ve bu olay tetiklendiğinde konsola bir msj yazdırılıyor. İlk iki olay parametre beklemeyen bir callback' i tetiklerken üçüncü olayın callback'i a parametresinin geçilmesini bekler. Konsola mesajların yazılmasıyla foo olaylarının tetiklendiğini ve callback fonksiyonların çalıştırıldığını anlayacağız.Çıktılardan görüldüğü gibi callback fonksiyonlar yukarıdan aşağıya sırayla çağrılıyor.
*/

myEmitter.on('foo', () => console.log('foo olayı tetiklendi - 1'));
myEmitter.on('foo', () => console.log('foo olayı tetiklendi - 2'));
myEmitter.on('foo', (a) => {
  console.log('parametreli foo olayı tetiklendi - 3')
  console.log('a parametresi: ', a)
});

console.log("myEmitter: ", myEmitter)

//? Aşağıdaki çıktıdan da görüleceği gibi on('foo', () => ..) metodu çağrıldığında EventEmitter nesnesine dizi tutan bir foo özelliği ekleniyor ve callback fonksiyonunu bu diziye eleman olarak koyuyor. Sonraki her on('foo', () => ..) çağrıları bu diziye kendi callback' lerini ekliyor. Yani her olay, kendi adıyla oluşturulan bir özellikte kendisine atanmış tüm callback' leri topluyor.
/*
EventEmitter {
  _events: [Object: null prototype] {
    foo: [
      [Function (anonymous)],
      [Function (anonymous)],
      [Function (anonymous)]
    ]
  },
  _eventsCount: 1,
  _maxListeners: undefined,
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}
*/

//? vsc de emit() tanımı:
//(method) NodeJS.EventEmitter<DefaultEventMap>.emit<K>(eventName: string | symbol, ...args: AnyRest): boolean
//eventName adlı olay için kayıtlı dinleyicilerin her birini, kayıt sırasına göre eş zamanlı olarak çağırır ve her birine verilen argümanları iletir. Olayın dinleyicileri varsa true, yoksa false döndürür. 

//todo --- emit() metodu: js ile tarayıcıda çalışırken sayfa üzerinden dinlediğimiz bir olayı tetikleyip olay işleyicinin nasıl çalıştığını takip edebiliyorduk.node ortamında ise olayı tetiklemek için EventEmitter

//TODO --'foo' olayını emit() fonksiyonu ile iki defa yayınlıyoruz/yayıyoruz. İkincisinde bir parametre de geçiyoruz. Bir olayı emit ettiğinizde o olayla ilişkilendirilmiş tüm callback' ler tanımlanma sırasına göre çalıştırılır. foo olayı için yukarıda üç dinleyici ve üç callback tanımladığımız için bu üç callback de, foo olayı emit edildikten sonra çağrılacaktır.

myEmitter.emit('foo')
myEmitter.emit('foo', 'some text')

//1. emit()' in ÇIKTILARI
// foo olayı tetiklendi - 1
// foo olayı tetiklendi - 2
// parametreli foo olayı tetiklendi - 3
// a parametresi:  undefined

//2. emit()' in ÇIKTILARI
// foo olayı tetiklendi - 1
// foo olayı tetiklendi - 2
// parametreli foo olayı tetiklendi - 3
// a parametresi:  some text

myEmitter.on('bar', () => console.log('bar olayı tetiklendi'))

console.log("myEmitter: ", myEmitter)
//? Aşağıdaki çıktıda foo dan sonra bir de bar öz. ekleniği görülüyor. Demek ki dinlenen her olay için _events nesnesine o olayın adıyla bir öz. ekleniyor ve olay için tanımlanmış her bir callback de diziye alınıyor. Ayrıca _eventsCount değeri de 1' den 2' ye çıktı. Bu da sanırım olay türü adedini tutuyor.
/*
EventEmitter {
  _events: [Object: null prototype] {
    foo: [
      [Function (anonymous)],
      [Function (anonymous)],
      [Function (anonymous)]
    ],
    bar: [Function (anonymous)]
  },
  _eventsCount: 2,
  _maxListeners: undefined,
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}
*/

//TODO --bar olayı emit edildiğinde sadece üstteki dinleyicinin callback' i çalışır. foo olay dinleyicilerinin callback' leri çalışmaz.

//todo -- once() metodu da on() gibi olay dinleyici eklemek için kullanılır. on()' dan farkı sadece olayın ilk tetiklenmesinde (veya ilk emit() de) olay işleyici fonksiyonunun çağrılması ve bir daha (emit() edilse de) çağrılmamasıdır. Yani once() ile dinlediğiniz bir olay ikinci ve sonraki emit() 'leri, var olmayan tanımlanmamış bir olayı emit etmeye çalışmak gibidir ve bu emit() lerin hepsi false döndürecektir.

myEmitter.once('bar', () => console.log('once ile dinlenen bar olayı tetiklendi'))
myEmitter.emit('bar')

console.log("myEmitter: ", myEmitter)

myEmitter.emit('bar')
//todo --bar olayı ikinci kez emit edildiğinde once ile dinlenen bar olay işleyici fonksiyonları çalıştırılmaz. Zira 79. satırdaki ilk emit de, bir kez çalıştırılmıştı ve bundan sonra EventsEmitter nesnesindeeki bar dizisinden bu callback çıkarıldı. Bu yüzden satırdaki emit te çalıştırılmadı. on() ile dinlenen olayların callback' leri ise her emit' te çalıştırılır.


const myEmitter2 = new EventEmitter();

let m = 0;

myEmitter2.on('event', () => {
  console.log("m değeri:", ++m)
})

myEmitter2.emit('event')//1
console.log("m: ", m)//1


myEmitter2.emit('event')//2
console.log("m: ", m)//2
//todo -- Aşağıdaki çıktıların sırasına bakarsanız yukarıdaki kodda herhangibir asenkron işlem yapılmadığını görebilirsiniz. Bu dosyanın kodu yürütüldüğünde ilk emit() çağrısıyla işleyeci fonk. çalıştırılır ve m=1 sonucu fonk. içindeki console.log() dan yazdırılır. Daha sonra global alandaki console.log() çalışır. Sonrasında ikinci emit() çağrısı ve m=2 için aynı şeyler gerçekleşir. Görüldüğü gibi bu akış, normal bildiğimiz senkron kod akışıdır.
// m değeri: 1
// m:  1
// m değeri: 2
// m:  2