use std::fmt::Display;

#[derive(Debug, PartialEq, Eq, Clone, Copy, Hash)]
#[allow(dead_code)]
pub enum Lines {
    A, C, E, B, D, F, M, G, J, Z, N, Q, R, W, L, _1, _2, _3, _4, _5, _6, _7, SIR
}

#[allow(dead_code)]
impl Lines {
    pub fn to_uri(&self) -> &str {
        match self {
            Lines::A | Lines::C | Lines::E => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
            Lines::B | Lines::D | Lines::F | Lines::M => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm", 
            Lines::G => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
            Lines::J | Lines::Z => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
            Lines::N | Lines::Q | Lines::R | Lines::W => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
            Lines::L => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
            Lines::_1 | Lines::_2 | Lines::_3 | Lines::_4 | Lines::_5 | Lines::_6 | Lines::_7 => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
            Lines::SIR => "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si",
        }
    }

    pub fn to_line(route_str: &str) -> Lines {
        match route_str {
            "4" => Lines::_4,
            "B" => Lines::B,
            "D" => Lines::D,
            "6" => Lines::_6,
            "1" => Lines::_1,
            _ => Lines::_4,
        }
    }
}

impl Display for Lines {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str_ver = match self {
            Lines::A => "A",
            Lines::C => "C",
            Lines::E => "E",
            Lines::B => "B",
            Lines::D => "D",
            Lines::F => "F",
            Lines::M => "M",
            Lines::G => "G",
            Lines::J => "J",
            Lines::Z => "Z",
            Lines::N => "N",
            Lines::Q => "Q",
            Lines::R => "R",
            Lines::W => "W",
            Lines::L => "L",
            Lines::_1 => "1",
            Lines::_2 => "2",
            Lines::_3 => "3",
            Lines::_4 => "4",
            Lines::_5 => "5",
            Lines::_6 => "6",
            Lines::_7 => "7",
            Lines::SIR => "SIR",
        };
        write!(f, "{}", str_ver)
    }
}
